import requests
import os
from urllib.parse import quote
from dotenv import load_dotenv

load_dotenv()

COC_API_TOKEN = os.getenv("COC")
HEADERS = {
    "Authorization": f"Bearer {COC_API_TOKEN}"
}
BASE_URL = "https://cocproxy.royaleapi.dev/v1"

def get_player(player_tag):
    url = f"{BASE_URL}/players/{quote(player_tag)}"
    response = requests.get(url, headers=HEADERS)
    return response.json() if response.status_code == 200 else None

def get_clan(clan_tag):
    url = f"{BASE_URL}/clans/{quote(clan_tag)}"
    response = requests.get(url, headers=HEADERS)
    return response.json() if response.status_code == 200 else None
