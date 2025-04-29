import os
import requests
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import time
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Create images directory if it doesn't exist
os.makedirs('images', exist_ok=True)

# Openverse API configuration
OPENVERSE_API = "https://api.openverse.org/v1/images/"
ACCESS_TOKEN = os.getenv('OPENVERSE_ACCESS_TOKEN')

# Search queries for each artwork
search_queries = {
    'andrea-ghirardelli.jpg': 'Andrea Fountain Ghirardelli',
    'union-square-fountain.jpg': 'Union Square Fountain San Francisco',
    'aurora-embarcadero.jpg': 'Fountain Embarcadero San Francisco',
    'garden-remembrance.jpg': 'Japanese Memorial Garden San Francisco',
    'origami-fountains.jpg': 'Nihonmachi Fountain San Francisco'
}

def create_placeholder_image(filename, text):
    """Create a placeholder image with text."""
    img = Image.new('RGB', (800, 600), color='lightgray')
    d = ImageDraw.Draw(img)
    
    # Add title text
    title = "Ruth Asawa Public Art"
    d.text((400, 250), title, fill='black', anchor="mm", align="center")
    
    # Add artwork name
    artwork_name = filename.split('.')[0].replace('-', ' ').title()
    d.text((400, 300), artwork_name, fill='black', anchor="mm", align="center")
    
    # Add description
    description = text
    d.text((400, 350), description, fill='black', anchor="mm", align="center")
    
    return img

def search_and_download_image(query, filename):
    """Search Openverse API and download the first matching image."""
    try:
        headers = {
            'User-Agent': 'RuthAsawaMapProject/1.0 (chendanzhe@gmail.com)',
            'Accept': 'application/json',
            'Authorization': f'Bearer {ACCESS_TOKEN}'
        }
        
        print(f"Searching Openverse for: {query}")
        params = {
            'q': query,
            'license_type': 'commercial,modification',  # Only get images that can be used commercially
            'page_size': 1
        }
        
        response = requests.get(OPENVERSE_API, headers=headers, params=params)
        
        if response.status_code == 200:
            data = response.json()
            if data['results']:
                image_url = data['results'][0]['url']
                print(f"Found image at: {image_url}")
                
                # Download the image
                img_response = requests.get(image_url)
                if img_response.status_code == 200:
                    img = Image.open(BytesIO(img_response.content))
                    img.thumbnail((800, 800))  # Resize while maintaining aspect ratio
                    img.save(f'images/{filename}', 'JPEG', quality=85)
                    print(f"Successfully downloaded and saved {filename}")
                    return True
                else:
                    print(f"Failed to download image: HTTP {img_response.status_code}")
            else:
                print("No images found")
        else:
            print(f"Failed to search Openverse: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"Error: {str(e)}")
    
    return False

# Dictionary of placeholder descriptions
placeholder_texts = {
    'andrea-ghirardelli': "Bronze fountain featuring mermaids, sea turtles and frogs",
    'union-square-fountain': "Iconic fountain with water features and bronze elements",
    'aurora-embarcadero': "Abstract fountain inspired by origami and natural forms",
    'garden-remembrance': "Memorial garden with sculptural elements",
    'origami-fountains': "Japanese-inspired fountains with geometric forms"
}

# Process each artwork with rate limiting
for filename, query in search_queries.items():
    if not search_and_download_image(query, filename):
        # Create placeholder with descriptive text
        artwork_name = filename.split('.')[0]
        description = placeholder_texts.get(artwork_name, "Public artwork by Ruth Asawa")
        placeholder = create_placeholder_image(filename, description)
        placeholder.save(f'images/{filename}', 'JPEG', quality=85)
        print(f"Created placeholder image for {filename}")
    
    # Add a delay between requests to avoid rate limiting
    time.sleep(2)

print("All images have been processed.") 