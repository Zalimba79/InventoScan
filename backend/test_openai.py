#!/usr/bin/env python3
"""Test script to check OpenAI API configuration"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Remove proxy settings that might interfere
os.environ.pop('HTTP_PROXY', None)
os.environ.pop('HTTPS_PROXY', None)
os.environ.pop('http_proxy', None)
os.environ.pop('https_proxy', None)

api_key = os.getenv("OPENAI_API_KEY")
print(f"API Key loaded: {'Yes' if api_key else 'No'}")
print(f"API Key starts with: {api_key[:20] if api_key else 'N/A'}...")

try:
    from openai import OpenAI
    client = OpenAI(api_key=api_key)
    
    # Test with a simple completion
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": "Say 'test successful'"}],
        max_tokens=10
    )
    
    print(f"✅ Test successful: {response.choices[0].message.content}")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print("\nTrying alternative approach...")
    
    # Alternative approach using requests
    import requests
    import json
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": "Say 'test successful'"}],
        "max_tokens": 10
    }
    
    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=data
        )
        result = response.json()
        if response.status_code == 200:
            print(f"✅ Alternative approach works: {result['choices'][0]['message']['content']}")
        else:
            print(f"❌ API Error: {result}")
    except Exception as e2:
        print(f"❌ Alternative approach failed: {e2}")