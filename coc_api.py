import requests
import os
from urllib.parse import quote

# Load token
COC_API_TOKEN = os.getenv("COC")
if not COC_API_TOKEN:
    raise ValueError("COC token is missing. Set it in environment variables.")

BASE_URL = "https://proxy.royaleapi.dev/v1"
HEADERS = {
    "Authorization": f"Bearer {COC_API_TOKEN}"
}

def get_player(player_tag: str):
    try:
        url = f"{BASE_URL}/players/{quote(player_tag)}"
        response = requests.get(url, headers=HEADERS, timeout=10)
        return response.json()
    except requests.RequestException as e:
        print(f"[ERROR] Player API failed: {e}")
        return None

def get_clan(clan_tag: str):
    try:
        url = f"{BASE_URL}/clans/{quote(clan_tag)}"
        response = requests.get(url, headers=HEADERS, timeout=10)
        return response.json()
    except requests.RequestException as e:
        print(f"[ERROR] Clan API failed: {e}")
        return None
