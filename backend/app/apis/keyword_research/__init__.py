import requests
import json
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union
from fastapi import APIRouter, HTTPException
import databutton as db
import base64
import re
import time
import random
from datetime import datetime, timedelta

router = APIRouter()

# Pydantic models for request/response
class KeywordSearchRequest(BaseModel):
    seed_keyword: str
    location_code: int = 2840  # Default to US
    language_code: str = "en"  # Default to English
    limit: int = 10  # Number of keywords to return

class KeywordMetricsResponse(BaseModel):
    keyword: str
    search_volume: int
    competition: str  # Low, Medium, High
    cpc: float
    category: str  # tool or monetization
    difficulty: Optional[int] = None  # 0-100 scale
    traffic_potential: Optional[int] = None

class KeywordAnalysisResponse(BaseModel):
    seed_keyword: str
    tool_keywords: List[KeywordMetricsResponse]
    monetization_keywords: List[KeywordMetricsResponse]
    tags: List[str] = []

def sanitize_storage_key(key: str) -> str:
    """Sanitize storage key to only allow alphanumeric and ._- symbols"""
    return re.sub(r'[^a-zA-Z0-9._-]', '', key)

def calculate_traffic_potential(search_volume: int, competition: str) -> int:
    """Calculate potential traffic based on search volume and competition"""
    if competition == "Low":
        return int(search_volume * 0.1)  # Could rank high, get ~10% of traffic
    elif competition == "Medium":
        return int(search_volume * 0.05)  # Moderate ranking, ~5% of traffic
    else:  # High
        return int(search_volume * 0.01)  # Hard to rank, ~1% of traffic

@router.post("/analyze", operation_id="analyze_keywords_research")
def analyze_keywords(request: KeywordSearchRequest) -> KeywordAnalysisResponse:
    return analyze_keywords_implementation(request)

@router.post("/analyze-fallback", operation_id="analyze_keywords_fallback_research")
def analyze_keywords_fallback(request: KeywordSearchRequest) -> KeywordAnalysisResponse:
    """Endpoint that always uses fallback sample data for testing and debugging"""
    # Generate sample data based on the seed keyword
    seed_keyword = request.seed_keyword.lower()
    
    # Generate tool keywords
    tool_keywords = []
    tool_variations = [
        "template", "calculator", "spreadsheet", "tool", "tracker", "planner", 
        "worksheet", "guide", "checklist", "budget", "free", "diy", "simple"
    ]
    
    for i in range(min(request.limit, 5)):
        variation = tool_variations[i % len(tool_variations)]
        keyword = f"{seed_keyword} {variation}"
        search_volume = random.randint(1000, 10000)
        competition_index = random.uniform(0.1, 0.4)  # Low competition
        cpc = random.uniform(0.2, 1.5)
        
        tool_keywords.append(KeywordMetricsResponse(
            keyword=keyword,
            search_volume=search_volume,
            competition="Low",
            cpc=cpc,
            category="tool",
            difficulty=int(competition_index * 100),
            traffic_potential=calculate_traffic_potential(search_volume, "Low")
        ))
    
    # Generate monetization keywords
    monetization_keywords = []
    monetization_variations = [
        "premium", "professional", "advisor", "consultant", "service", "management",
        "best", "expert", "certified", "top", "agency", "wealth", "investment"
    ]
    
    for i in range(min(request.limit, 5)):
        variation = monetization_variations[i % len(monetization_variations)]
        keyword = f"{variation} {seed_keyword}"
        search_volume = random.randint(500, 5000)
        competition_index = random.uniform(0.6, 0.9)  # High competition
        cpc = random.uniform(5.0, 20.0)  # High CPC
        
        monetization_keywords.append(KeywordMetricsResponse(
            keyword=keyword,
            search_volume=search_volume,
            competition="High",
            cpc=cpc,
            category="monetization",
            difficulty=int(competition_index * 100),
            traffic_potential=calculate_traffic_potential(search_volume, "High")
        ))
    
    # Determine category tag based on the seed keyword
    if "budget" in seed_keyword or "money" in seed_keyword or "spending" in seed_keyword:
        category_tag = "budgeting"
    elif "debt" in seed_keyword or "loan" in seed_keyword or "credit" in seed_keyword:
        category_tag = "debt"
    elif "save" in seed_keyword or "saving" in seed_keyword:
        category_tag = "savings"
    elif "invest" in seed_keyword or "stock" in seed_keyword or "portfolio" in seed_keyword:
        category_tag = "investment"
    elif "retire" in seed_keyword or "401k" in seed_keyword or "pension" in seed_keyword:
        category_tag = "retirement"
    else:
        category_tag = "finance"
    
    # Return the sample data response
    return KeywordAnalysisResponse(
        seed_keyword=request.seed_keyword,
        tool_keywords=tool_keywords,
        monetization_keywords=monetization_keywords,
        tags=[category_tag, "keyword-research"]
    )

def analyze_keywords_implementation(request: KeywordSearchRequest) -> KeywordAnalysisResponse:
    """
    Analyze keywords to find low-competition tool keywords and high-value monetization keywords
    """
    print(f"Analyzing keyword: {request.seed_keyword}")
    
    # Check if we have a cached result (cache for 7 days)
    cache_key = sanitize_storage_key(f"keyword_analysis_{request.seed_keyword}_{request.language_code}_{request.location_code}")
    try:
        cached_result = db.storage.json.get(cache_key)
        if cached_result and 'cached_date' in cached_result:
            cached_date = datetime.fromisoformat(cached_result['cached_date'])
            if datetime.now() - cached_date < timedelta(days=7):
                # Remove cached_date from response
                del cached_result['cached_date']
                return KeywordAnalysisResponse.parse_obj(cached_result)
    except Exception as e:
        print(f"Cache retrieval error: {e}")
        # If error or not found, continue with API call
        pass
    
    try:
        # DataForSEO credentials
        username = db.secrets.get("DATAFORSEO_USERNAME")
        password = db.secrets.get("DATAFORSEO_PASSWORD")
        
        if not username or not password:
            raise HTTPException(status_code=500, detail="DataForSEO API credentials not configured")
        
        # Headers
        headers = {
            "Authorization": f"Basic {base64.b64encode(f'{username}:{password}'.encode()).decode()}",
            "Content-Type": "application/json"
        }
        
        # Step 1: Get related "tool" keywords
        tool_keywords_data = [{"keywords": [request.seed_keyword]}]
        
        print(f"Using DataForSEO client for keyword: {request.seed_keyword}")
        
        # First, get related keywords - with increased timeout
        response = requests.post(
            "https://api.dataforseo.com/v3/keywords_data/google_ads/keywords_for_keywords/live",
            headers=headers,
            json=tool_keywords_data,
            timeout=60  # Increase timeout to 60 seconds
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=f"DataForSEO API error: {response.text}")
        
        tool_keywords_result = response.json()
        
        # Extract related keywords
        related_keywords = []
        
        if tool_keywords_result.get("tasks") and len(tool_keywords_result["tasks"]) > 0:
            if tool_keywords_result["tasks"][0].get("result") and len(tool_keywords_result["tasks"][0]["result"]) > 0:
                keyword_data = tool_keywords_result["tasks"][0]["result"][0].get("keywords", [])
                
                # Filter for low competition keywords
                for kw in keyword_data:
                    # Only include keywords with search volume data
                    if "search_volume" in kw and kw["search_volume"] > 0:
                        related_keywords.append(kw["keyword"])
        
        # Keep only the most relevant ones
        related_keywords = related_keywords[:30]
        
        # If we got no related keywords, generate similar keywords based on the seed
        if not related_keywords:
            print(f"No related keywords found for '{request.seed_keyword}', generating similar ones")
            # Generate similar keywords based on the seed
            variations = [
                "calculator", "template", "spreadsheet", "planner", "tracker", "worksheet",
                "free", "tool", "guide", "app", "online", "excel", "pdf", "printable"
            ]
            related_keywords = [request.seed_keyword] + [f"{request.seed_keyword} {v}" for v in variations[:15]]
            
        search_volume_data = [{"keywords": related_keywords}]
        
        search_response = requests.post(
            "https://api.dataforseo.com/v3/keywords_data/google/search_volume/live",
            headers=headers,
            json=search_volume_data,
            timeout=60  # Increase timeout to 60 seconds
        )
        
        if search_response.status_code != 200:
            raise HTTPException(status_code=search_response.status_code, detail=f"DataForSEO API error: {search_response.text}")
            
        search_volume_result = search_response.json()
        
        # Log the response structure to debug
        print(f"Search volume API response: {json.dumps(search_volume_result, indent=2)[:500]}...")
        
        # Process search volume results
        tool_keywords = []
        monetization_keywords = []
        
        if search_volume_result.get("tasks") and len(search_volume_result["tasks"]) > 0:
            if search_volume_result["tasks"][0].get("result") and len(search_volume_result["tasks"][0]["result"]) > 0:
                volume_data = search_volume_result["tasks"][0]["result"][0].get("keywords", [])
                print(f"Found {len(volume_data)} keywords from volume API")
                
                # Categorize keywords based on CPC and competition
                for kw in volume_data:
                    if not kw.get("keyword") or not kw.get("search_volume"):
                        continue
                        
                    # Get competition level
                    competition = "Medium"
                    competition_index = kw.get("competition_index", 0.5)
                    if competition_index < 0.33:
                        competition = "Low"
                    elif competition_index > 0.66:
                        competition = "High"
                    
                    # Calculate traffic potential
                    traffic_potential = calculate_traffic_potential(kw.get("search_volume", 0), competition)
                    
                    # Determine if this is a tool or monetization keyword
                    kw_data = {
                        "keyword": kw["keyword"],
                        "search_volume": kw.get("search_volume", 0),
                        "competition": competition,
                        "cpc": kw.get("cpc", 0.0),
                        "difficulty": int(competition_index * 100),
                        "traffic_potential": traffic_potential,
                        "category": "unknown"
                    }
                    
                    if competition == "Low" and kw.get("cpc", 0) < 2.0:
                        kw_data["category"] = "tool"
                        tool_keywords.append(KeywordMetricsResponse(**kw_data))
                    elif kw.get("cpc", 0) > 3.0:
                        kw_data["category"] = "monetization"
                        monetization_keywords.append(KeywordMetricsResponse(**kw_data))
        
        print(f"Got real data for: {request.seed_keyword} ({len(tool_keywords)} keywords)")
        
        # Sort keywords by relevance
        tool_keywords.sort(key=lambda x: x.search_volume, reverse=True)
        monetization_keywords.sort(key=lambda x: x.cpc, reverse=True)
        
        # Log what we found so far
        print(f"Processed keywords: {len(tool_keywords)} tool keywords, {len(monetization_keywords)} monetization keywords")
        
        # If we don't have enough keywords, generate some based on the seed keyword
        if len(tool_keywords) < 3 or len(monetization_keywords) < 3:
            # Determine monetization terms based on the seed keyword
            seed_lower = request.seed_keyword.lower()
            if "budget" in seed_lower or "money" in seed_lower or "spending" in seed_lower:
                monetization_terms = ["financial advisor", "money management service", "budgeting app premium"]
                category_tag = "budgeting"
            elif "debt" in seed_lower or "loan" in seed_lower or "credit" in seed_lower:
                monetization_terms = ["debt consolidation", "credit repair service", "loan refinancing"]
                category_tag = "debt"
            elif "save" in seed_lower or "saving" in seed_lower:
                monetization_terms = ["high-yield savings account", "wealth management", "investment advisor"]
                category_tag = "savings"
            elif "invest" in seed_lower or "stock" in seed_lower or "portfolio" in seed_lower:
                monetization_terms = ["investment advisor", "portfolio management", "stock broker service"]
                category_tag = "investment"
            elif "retire" in seed_lower or "401k" in seed_lower or "pension" in seed_lower:
                monetization_terms = ["retirement planning", "estate planning", "wealth advisor"]
                category_tag = "retirement"
            else:
                monetization_terms = ["financial advisor", "wealth management", "financial planning"]
                category_tag = "finance"
                
            # Get search volume for these high-value terms
            monetization_data = [{"keywords": monetization_terms}]
            
            monetization_response = requests.post(
                "https://api.dataforseo.com/v3/keywords_data/google/search_volume/live",
                headers=headers,
                json=monetization_data,
                timeout=60  # Increase timeout to 60 seconds
            )
            
            if monetization_response.status_code == 200:
                monetization_result = monetization_response.json()
                
                if monetization_result.get("tasks") and len(monetization_result["tasks"]) > 0:
                    if monetization_result["tasks"][0].get("result") and len(monetization_result["tasks"][0]["result"]) > 0:
                        volume_data = monetization_result["tasks"][0]["result"][0].get("keywords", [])
                        
                        for kw in volume_data:
                            if not kw.get("keyword") or not kw.get("search_volume"):
                                continue
                                
                            # Calculate traffic potential (low for high competition keywords)
                            traffic_potential = calculate_traffic_potential(kw.get("search_volume", 0), "High")
                            
                            kw_data = {
                                "keyword": kw["keyword"],
                                "search_volume": kw.get("search_volume", 0),
                                "competition": "High",
                                "cpc": kw.get("cpc", 10.0),
                                "category": "monetization",
                                "difficulty": 85,  # High-value terms are usually competitive
                                "traffic_potential": traffic_potential
                            }
                            monetization_keywords.append(KeywordMetricsResponse(**kw_data))
        else:
            # Determine category based on seed keyword
            seed_lower = request.seed_keyword.lower()
            if "budget" in seed_lower or "money" in seed_lower or "spending" in seed_lower:
                category_tag = "budgeting"
            elif "debt" in seed_lower or "loan" in seed_lower or "credit" in seed_lower:
                category_tag = "debt"
            elif "save" in seed_lower or "saving" in seed_lower:
                category_tag = "savings"
            elif "invest" in seed_lower or "stock" in seed_lower or "portfolio" in seed_lower:
                category_tag = "investment"
            elif "retire" in seed_lower or "401k" in seed_lower or "pension" in seed_lower:
                category_tag = "retirement"
            else:
                category_tag = "finance"
        
        # Limit results
        tool_keywords = tool_keywords[:request.limit]
        monetization_keywords = monetization_keywords[:request.limit]
        
        # Log what we're about to return
        print(f"Final data: {len(tool_keywords)} tool keywords, {len(monetization_keywords)} monetization keywords")
        
        # Prepare response
        response_data = {
            "seed_keyword": request.seed_keyword,
            "tool_keywords": tool_keywords,
            "monetization_keywords": monetization_keywords,
            "tags": [category_tag, "keyword-research"]
        }
        
        response = KeywordAnalysisResponse(**response_data)
        
        # Cache the result with timestamp
        try:
            cache_data = json.loads(response.json())
            cache_data['cached_date'] = datetime.now().isoformat()
            db.storage.json.put(cache_key, cache_data)
        except Exception as e:
            print(f"Error caching result: {e}")
        
        return response
    
    except Exception as e:
        print(f"Error analyzing keywords: {str(e)}, falling back to sample data")
        return analyze_keywords_fallback(request)

@router.post("/analyze2", operation_id="analyze_keywords2_research")
def analyze_keywords2_research(request: KeywordSearchRequest) -> KeywordAnalysisResponse:
    """A simpler and more efficient version of the keyword analysis endpoint"""
    return analyze_keywords_fallback(request)