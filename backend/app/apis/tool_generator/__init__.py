import json
import databutton as db
import re
from typing import List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException
from openai import OpenAI, AzureOpenAI
import os

router = APIRouter()

# Pydantic models for request/response
class ToolGenerationRequest(BaseModel):
    category: str
    prompt: str = ""
    complexity: str
    max_results: int = 3

class MonetizationIdea(BaseModel):
    idea: str
    description: str
    potential_value: str  # Low, Medium, High

class KeywordSuggestion(BaseModel):
    keyword: str
    search_volume: str  # Approximation like "High", "Medium", "Low"
    competition: str  # "High", "Medium", "Low"
    suggested_cpc: str  # Approximation like "$0.50-$1.50"

class ToolSuggestion(BaseModel):
    title: str
    description: str
    implementation_details: str
    category: str
    complexity: str
    keywords: List[KeywordSuggestion]
    monetization_ideas: List[MonetizationIdea]
    embed_code: Optional[str] = None

class ToolGenerationResponse(BaseModel):
    tools: List[ToolSuggestion]

@router.post("/generate", operation_id="generate_tool_ideas")
def generate_tool_ideas(request: ToolGenerationRequest) -> ToolGenerationResponse:
    """
    Generate tool ideas using OpenAI with detailed monetization strategies and keyword suggestions.
    """
    try:
        # Get OpenAI API key and project ID
        api_key = db.secrets.get("OPENAI_API_KEY")
        project_id = db.secrets.get("OPENAI_PROJECT_ID")
        
        if not api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
        # Create OpenAI client with Azure configuration if project ID is provided
        if project_id:
            try:
                client = AzureOpenAI(
                    api_key=api_key,
                    api_version="2023-12-01-preview",
                    azure_endpoint=f"https://{project_id}.openai.azure.com"
                )
                print(f"Using Azure OpenAI with project ID: {project_id}")
            except Exception as e:
                print(f"Error initializing Azure OpenAI: {e}. Falling back to standard OpenAI API.")
                client = OpenAI(api_key=api_key)
        else:
            client = OpenAI(api_key=api_key)
            print("Using standard OpenAI API")
        
        # Build the prompt for the OpenAI API
        print(f"Generating ideas for {request.category} with {request.complexity} complexity")
        system_prompt = """
        You are an expert tool designer and marketing strategist specialized in creating
        tools, templates, and calculators that connect free content to high-value monetization opportunities.
        
        For each tool idea you generate, provide:
        1. A compelling title and description
        2. Detailed implementation specifics (what it should include, features, formulas, design elements)
        3. Specific relevant keywords with search volume, competition estimates, and CPC values
        4. Concrete monetization strategies detailing how to connect this free tool to high-value offers
        5. Detailed HTML code for embedding this tool on a website, with proper JavaScript functionality
        
        Focus on the "Hidden Money Door" concept - where low-competition keywords can lead to high-value
        monetization opportunities. Be specific about the implementation details for spreadsheets, calculators, 
        or other tool formats.
        
        For keywords, ensure you provide:
        - Realistic search volume estimates as numeric values (e.g., "1,200")
        - Competition levels (Low, Medium, High)
        - Suggested CPC values with dollar signs (e.g., "$1.50")
        - Keywords that specifically relate to the tool but could lead to higher-value monetization
        
        For monetization ideas, be specific about:
        - The exact product or service being promoted
        - How it connects to the free tool
        - Potential value or commission (with specific dollar amounts)
        
        For the embed code, provide:
        - Clean, functional HTML, CSS, and JavaScript
        - Responsive design elements that work on different screen sizes
        - Properly escaped code that can be embedded in an iframe or directly in a website
        - Any necessary external libraries or dependencies
        """
        
        user_prompt = f"""
        Create {request.max_results} detailed tool ideas related to {request.category} at a {request.complexity} complexity level.
        
        {"Specific focus: " + request.prompt if request.prompt else ""}
        
        For each tool:
        1. Provide a clear title and compelling description
        2. Include specific implementation details (formulas, fields, features it should have)
        3. Suggest 4-6 relevant keywords with real-world search volume estimates in numeric format (e.g., "1,200"), specific competition level (Low/Medium/High), and approximate CPC with dollar sign (e.g., "$1.50")
        4. Create 3-4 detailed monetization strategies explaining exactly how to connect this free tool to high-value offers, with specific potential value or commission amounts
        5. Provide HTML/CSS/JS code that creates an interactive, embeddable version of this tool
        
        Format your response as a JSON object with a 'tools' array containing tool objects with these properties:
        - title (string): The name of the tool
        - description (string): A compelling description of the tool
        - implementation_details (string): Specific details on what the tool includes, formulas, etc.
        - category (string): The category (should match "{request.category}")
        - complexity (string): The complexity level (should match "{request.complexity}")
        - keywords (array of objects): Each with 'keyword', 'search_volume', 'competition', and 'suggested_cpc'
        - monetization_ideas (array of objects): Each with 'idea', 'description', and 'potential_value'
        - embed_code (string): HTML/CSS/JS code that creates a functional version of the tool
        
        Example format:
        {{"tools": [
          {{"title": "Tool Name", "description": "Tool description", "implementation_details": "Details...", "category": "{request.category}", "complexity": "{request.complexity}", 
            "keywords": [{{"keyword": "example keyword", "search_volume": "1,500", "competition": "Low", "suggested_cpc": "$0.95"}}],
            "monetization_ideas": [{{"idea": "Premium Version", "description": "Offer a premium version with more features", "potential_value": "$29 per month"}}],
            "embed_code": "<div class=\\"tool-container\\">...</div>"}}
        ]}}
        """
        
        # Call OpenAI API
        print(f"Generating tool ideas for category: {request.category}, complexity: {request.complexity}")
        try:
            if project_id:
                # Azure OpenAI uses deployment names instead of model names
                response = client.chat.completions.create(
                    model="gpt-4o",  # Replace with your actual deployment name
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.7,  # Slightly creative but still focused
                    max_tokens=2500,  # Allow for detailed responses
                    response_format={"type": "json_object"}
                )
            else:
                # Standard OpenAI API
                response = client.chat.completions.create(
                    model="gpt-4o-mini",  # Using the mini model for cost efficiency
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.7,  # Slightly creative but still focused
                    max_tokens=2500,  # Allow for detailed responses
                    response_format={"type": "json_object"}
                )
        except Exception as e:
            print(f"Error calling OpenAI API: {e}")
            # If there's an error with the Azure deployment name, try with a standard model
            if project_id:
                print("Trying with standard OpenAI API as fallback")
                client = OpenAI(api_key=api_key)
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.7,
                    max_tokens=2500,
                    response_format={"type": "json_object"}
                )
            else:
                raise
        
        # Extract the response text
        response_text = response.choices[0].message.content
        
        # Parse the response JSON
        try:
            print(f"Raw response first 200 chars: {response_text[:200]}...")
            response_data = json.loads(response_text)
            
            # Handle various possible response formats
            if "tools" in response_data:
                # Already in correct format
                tool_data = response_data
            elif "financial_tools" in response_data:
                # Handle format with financial_tools array
                tool_data = {"tools": response_data["financial_tools"]}
            elif isinstance(response_data, list):
                # Direct list of tools
                tool_data = {"tools": response_data}
                print(f"Format corrected: Converted direct list to object with tools array")
            else:
                # Look for any array that might contain tools
                found_array = None
                for key, value in response_data.items():
                    if isinstance(value, list) and len(value) > 0:
                        found_array = value
                        break
                        
                if found_array:
                    tool_data = {"tools": found_array}
                else:    
                    # If all else fails, wrap the entire response as a single tool
                    # Construct a valid tool object
                    tool = {
                        "title": response_data.get("title", "Financial Tool"),
                        "description": response_data.get("description", "Generated financial tool"),
                        "implementation_details": response_data.get("implementation_details", "Generated by AI"),
                        "category": request.category,
                        "complexity": request.complexity,
                        "keywords": response_data.get("keywords", [{
                            "keyword": f"{request.category} tool",
                            "search_volume": "Medium",
                            "competition": "Medium",
                            "suggested_cpc": "$1.00"
                        }]),
                        "monetization_ideas": response_data.get("monetization_ideas", [{
                            "idea": "Premium version",
                            "description": "Offer a premium version with additional features",
                            "potential_value": "Medium"
                        }])
                    }
                    tool_data = {"tools": [tool]}
            
            # Print the formatted data for debugging
            print(f"Formatted tool data: {json.dumps(tool_data)[:200]}...")
            
            # Extra validation to ensure we have proper keywords and monetization ideas
            for tool in tool_data.get("tools", []):
                # Ensure keywords is a non-empty array of objects
                if not tool.get("keywords") or not isinstance(tool["keywords"], list) or len(tool["keywords"]) == 0:
                    tool["keywords"] = [
                        {"keyword": f"{request.category} {tool['title'].lower()}", "search_volume": "1,200", "competition": "Medium", "suggested_cpc": "$1.00"},
                        {"keyword": f"free {request.category} tool", "search_volume": "2,400", "competition": "Low", "suggested_cpc": "$0.75"}
                    ]
                    print(f"Fixed missing keywords for {tool['title']}")
                
                # Ensure monetization_ideas is a non-empty array of objects
                if not tool.get("monetization_ideas") or not isinstance(tool["monetization_ideas"], list) or len(tool["monetization_ideas"]) == 0:
                    tool["monetization_ideas"] = [
                        {"idea": "Premium version", "description": f"Enhanced version of the {tool['title']} with advanced features", "potential_value": "$19.99 per month"},
                        {"idea": "Affiliate partnerships", "description": "Connect users to relevant products and services", "potential_value": "$50-100 per conversion"}
                    ]
                    print(f"Fixed missing monetization ideas for {tool['title']}")
                    
                # Ensure embed_code is present
                if not tool.get("embed_code") or not isinstance(tool["embed_code"], str) or len(tool["embed_code"]) < 50:
                    basic_html = f'''
                    <div class="tool-container" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                      <h2 style="color: #333; margin-top: 0;">{tool['title']}</h2>
                      <p style="color: #666;">{tool['description']}</p>
                      <div class="tool-content" style="margin: 20px 0;">
                        <!-- Tool content would go here -->
                        <p style="font-style: italic; color: #999;">This is a placeholder for the {tool['title']} tool. The actual implementation would include interactive elements.</p>
                      </div>
                      <div class="tool-footer" style="font-size: 12px; color: #999; text-align: center;">
                        Powered by <a href="https://www.themoneygate.com" style="color: #0066cc; text-decoration: none;">TheMoneyGate</a>
                      </div>
                    </div>
                    '''
                    tool["embed_code"] = basic_html.strip()
                    print(f"Added basic embed_code for {tool['title']}")
                
                
            # Validate and return the response
            return ToolGenerationResponse(**tool_data)
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON: {e}")
            print(f"Raw response: {response_text}")
            raise HTTPException(status_code=500, detail=f"Invalid response format from AI: {e}")
            
    except Exception as e:
        print(f"Error generating tool ideas: {str(e)}")
        # Return a more friendly error to the user
        raise HTTPException(status_code=500, detail="Error generating tool ideas. Please try again.")
