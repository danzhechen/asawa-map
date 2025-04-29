import requests
import json

# Openverse API registration endpoint
REGISTER_URL = "https://api.openverse.org/v1/auth_tokens/register/"

# User information
user_data = {
    "name": "dan_c_asawa_map",
    "description": "Ruth Asawa Public Art Map Project",
    "email": "chendanzhe@gmail.com"
}

def register_api_key():
    try:
        print("Registering for Openverse API key...")
        response = requests.post(REGISTER_URL, json=user_data)
        
        if response.status_code == 201:
            data = response.json()
            print("\nRegistration successful!")
            print("\nYour client ID:", data.get('name'))
            print("Your client secret:", data.get('client_secret'))
            print("\nPlease save these credentials securely. You'll need them for the download_images.py script.")
        else:
            print(f"Registration failed: {response.status_code}")
            print("Response:", response.text)
            
    except Exception as e:
        print(f"Error during registration: {str(e)}")

if __name__ == "__main__":
    register_api_key() 