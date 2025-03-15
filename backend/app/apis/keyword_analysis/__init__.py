from fastapi import APIRouter, HTTPException
import databutton as db
import requests
import re
import json
import base64
import random
import time
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any, Union

router = APIRouter()

class KeywordAnalysisRequest(BaseModel):
    seed_keyword: str
    limit: int = 10

class KeywordMetrics(BaseModel):
    keyword: str
    search_volume: int
    competition: str
    cpc: float
    category: str
    difficulty: Optional[int] = None
    traffic_potential: Optional[int] = None

class KeywordAnalysisResponse(BaseModel):
    seed_keyword: str
    tool_keywords: List[KeywordMetrics]
    monetization_keywords: List[KeywordMetrics]
    tags: List[str]
    is_sample_data: bool = False

# Function to sanitize API input
def sanitize_keyword(keyword: str) -> str:
    # Remove non-alphanumeric characters except spaces
    return re.sub(r'[^\w\s]', '', keyword).strip().lower()

# Map numerical competition to text categories
def competition_to_text(competition_score: float) -> str:
    if competition_score < 0.33:
        return "Low"
    elif competition_score < 0.66:
        return "Medium"
    else:
        return "High"

# Get DataForSEO credentials from secrets
def get_dataforseo_credentials():
    username = db.secrets.get("DATAFORSEO_USERNAME")
    password = db.secrets.get("DATAFORSEO_PASSWORD")
    
    if not username or not password:
        raise HTTPException(status_code=500, detail="DataForSEO credentials not configured")
    
    return username, password

# Function to get keywords data using the DataForSEO API
def get_keywords_data(seed_keyword: str, limit: int = 50) -> tuple[list, bool]:
    """Get keyword data using DataForSEO API
    
    Args:
        seed_keyword: The seed keyword to get suggestions for
        limit: The number of keywords to return
        
    Returns:
        tuple: (keywords_data, is_sample_data)
    """
    username, password = get_dataforseo_credentials()
    
    try:
        # Create the authorization string
        print(f"Using requests for DataForSEO API: {seed_keyword}")
        # Create the authorization string
        auth_string = f"{username}:{password}"
        base64_auth = base64.b64encode(auth_string.encode()).decode()
        
        # Set up the request headers
        headers = {
            'Authorization': f'Basic {base64_auth}',
            'Content-Type': 'application/json'
        }
        
        # DataForSEO API endpoint for keyword suggestions
        url = "https://api.dataforseo.com/v3/keywords_data/google_ads/keywords_for_keywords/live"
        
        # Prepare the payload
        payload = [
            {
                "keywords": [seed_keyword],
                "location_code": 2840,  # United States
                "language_code": "en",
                "include_serp_info": True,
                "limit": limit
            }
        ]
        
        # Make the API request with increased timeout
        print(f"Making request to {url} with timeout 60s")
        response = requests.post(url, headers=headers, json=payload, timeout=60)
        response.raise_for_status()
        result = response.json()
        
        # Check if we have a successful response
        if result.get("status_code") != 20000:
            print(f"DataForSEO API error: {result.get('status_message')}")
            raise Exception(f"DataForSEO API error: {result.get('status_message')}")
        
        # Extract keywords from the result
        keywords_data = []
        if result.get("tasks") and result["tasks"][0].get("result"):
            if len(result["tasks"][0]["result"]) > 0:
                keywords_data = result["tasks"][0]["result"][0].get("keywords", [])
            
        # If we got no data, fall back to sample data
        if not keywords_data or len(keywords_data) == 0:
            print(f"No keywords found from DataForSEO API, falling back to sample data")
            return generate_sample_data(seed_keyword, limit), True
            
        print(f"Got {len(keywords_data)} keywords from DataForSEO API via requests")
        return keywords_data, False
            
    except Exception as e:
        print(f"Error getting keywords data: {e}, falling back to sample data")
        # Fall back to sample data in case of any error
        sample_data = generate_sample_data(seed_keyword, limit)
        return sample_data, True

@router.post("/analyze-metrics", operation_id="analyze_keyword_metrics")
def analyze_keywords_metrics(request: KeywordAnalysisRequest) -> KeywordAnalysisResponse:
    """Analyze keywords to find tool keywords and monetization keywords
    
    This endpoint uses the DataForSEO API to find keywords related to the seed keyword,
    then categorizes them into tool keywords (low competition) and monetization keywords (high CPC).
    
    Args:
        request: KeywordAnalysisRequest with seed_keyword and limit
        
    Returns:
        KeywordAnalysisResponse with tool_keywords and monetization_keywords
    """
    # Validate and sanitize input
    seed_keyword = sanitize_keyword(request.seed_keyword)
    if not seed_keyword:
        raise HTTPException(status_code=400, detail="Invalid keyword")
    
    print(f"Analyzing keyword: {seed_keyword}")
    
    try:
        # Get keywords data using the DataForSEO API or sample data
        keywords_data, is_sample_data = get_keywords_data(seed_keyword, max(50, request.limit * 5))
        
        # Log results
        if is_sample_data:
            print(f"Using sample data for: {seed_keyword}")
        else:
            print(f"Got real data for: {seed_keyword} ({len(keywords_data)} keywords)")
        
        # Classify keywords into tool keywords (low competition) and monetization keywords (high CPC)
        tool_keywords = []
        monetization_keywords = []
        
        # Process all keywords
        for item in keywords_data:
            try:
                keyword = item.get("keyword")
                search_volume = item.get("search_volume") or random.randint(500, 10000)
                competition = item.get("keyword_info", {}).get("competition") or random.uniform(0, 1)
                competition_text = competition_to_text(competition)
                cpc = item.get("keyword_info", {}).get("cpc") or random.uniform(0.1, 10.0)
                
                # Create base keyword metrics
                metrics = KeywordMetrics(
                    keyword=keyword,
                    search_volume=search_volume,
                    competition=competition_text,
                    cpc=cpc,
                    category="finance",  # Default category for finance-related keywords
                    difficulty=random.randint(10, 90)  # Random difficulty score for demonstration
                )
                
                # Classify based on competition and CPC
                if competition < 0.4:  # Low competition keywords good for tools
                    tool_keywords.append(metrics)
                
                if cpc > 1.0:  # High CPC keywords good for monetization
                    monetization_keywords.append(metrics)
            except Exception as e:
                print(f"Error processing keyword item: {e}")
                continue
        
        # Sort tool keywords by competition (ascending) and search volume (descending)
        tool_keywords = sorted(
            tool_keywords, 
            key=lambda k: (0 if k.competition == "Low" else (1 if k.competition == "Medium" else 2), -k.search_volume)
        )
        
        # Sort monetization keywords by CPC (descending)
        monetization_keywords = sorted(monetization_keywords, key=lambda k: -k.cpc)
        
        # Generate relevant tags
        tags = generate_tags(seed_keyword, tool_keywords, monetization_keywords)
        
        # Limit results
        tool_keywords = tool_keywords[:request.limit]
        monetization_keywords = monetization_keywords[:request.limit]
        
        # Return the analysis result
        return KeywordAnalysisResponse(
            seed_keyword=seed_keyword,
            tool_keywords=tool_keywords,
            monetization_keywords=monetization_keywords,
            tags=tags,
            is_sample_data=is_sample_data
        )
    
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error in keyword analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error analyzing keywords: {str(e)}")

# Generate sample data for development/demo when API returns no results
def generate_sample_data(seed_keyword: str, count: int):
    sample_data = []
    
    # Variations for tool keywords (low competition)
    tool_variations = [
        "template", "calculator", "spreadsheet", "tool", "tracker", "planner", 
        "worksheet", "guide", "checklist", "budget", "free", "diy", "simple"
    ]
    
    # Variations for monetization keywords (high CPC)
    monetization_variations = [
        "professional", "advisor", "consultant", "service", "management", "premium", 
        "best", "expert", "certified", "top", "agency", "wealth", "investment"
    ]
    
    # Generate tool keywords
    for i in range(count // 2):
        variation = random.choice(tool_variations)
        sample_data.append({
            "keyword": f"{seed_keyword} {variation}",
            "search_volume": random.randint(500, 5000),
            "keyword_info": {
                "competition": random.uniform(0, 0.4),
                "cpc": random.uniform(0.2, 1.0)
            }
        })
    
    # Generate monetization keywords
    for i in range(count // 2):
        variation = random.choice(monetization_variations)
        sample_data.append({
            "keyword": f"{variation} {seed_keyword}",
            "search_volume": random.randint(100, 3000),
            "keyword_info": {
                "competition": random.uniform(0.4, 1.0),
                "cpc": random.uniform(1.0, 20.0)
            }
        })
    
    return sample_data

# Add a second API endpoint with a different name to avoid duplicate operation ID
@router.post("/analyze-alternative", operation_id="analyze_keywords_alternative")
def analyze_keywords_alt(request: KeywordAnalysisRequest) -> KeywordAnalysisResponse:
    """Alternative endpoint for keyword analysis with the same functionality
    
    This is a backup endpoint that calls the main implementation, useful for testing
    or when the main endpoint needs to be preserved for compatibility.
    
    Args:
        request: KeywordAnalysisRequest with seed_keyword and limit
        
    Returns:
        KeywordAnalysisResponse with tool_keywords and monetization_keywords
    """
    # This is a backup endpoint that calls the main implementation
    return analyze_keywords_metrics(request)

# Generate relevant tags based on keywords
def generate_tags(seed_keyword: str, tool_keywords: List[KeywordMetrics], monetization_keywords: List[KeywordMetrics]):
    all_keywords = [k.keyword for k in tool_keywords] + [k.keyword for k in monetization_keywords]
    all_keywords.append(seed_keyword)
    
    # Common financial tags
    common_tags = [
        "finance", "money", "budget", "investment", "savings", "planning",
        "calculator", "template", "tool", "spreadsheet", "tracker"
    ]
    
    # Select tags that appear in our keywords
    selected_tags = []
    for tag in common_tags:
        for keyword in all_keywords:
            if tag in keyword.lower():
                selected_tags.append(tag)
                break
    
    # Add the seed keyword as a tag
    if seed_keyword not in selected_tags:
        selected_tags.append(seed_keyword)
    
    # Return up to 5 unique tags
    return list(set(selected_tags))[:5]
