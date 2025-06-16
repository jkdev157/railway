import logging
import os
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
from coc_api import get_player, get_clan

# Load env vars
BOT_TOKEN = os.getenv("TELEGRAM")

# Validate token presence
if not BOT_TOKEN:
    raise ValueError("TELEGRAM token is missing. Set it in environment variables.")

# Set up logging
logging.basicConfig(format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO)

# Command: /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "👋 Welcome to Clash of Clans Bot!\n"
        "Use /player <tag> to get player info.\n"
        "Use /clan <tag> to get clan info."
    )

# Command: /player <tag>
async def player(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if len(context.args) != 1:
        return await update.message.reply_text("❗ Usage: /player <tag>")
    
    tag = context.args[0].strip('#').upper()
    data = get_player(f"#{tag}")
    if not data or "reason" in data:
        return await update.message.reply_text("⚠️ Player not found or invalid tag.")

    name = data.get("name")
    th = data.get("townHallLevel", "?")
    clan = data.get("clan", {}).get("name", "No Clan")
    trophies = data.get("trophies", "?")
    heroes = ", ".join(f"{h['name']} Lv{h['level']}" for h in data.get("heroes", [])) or "No heroes listed"

    reply = (
        f"🏅 Player: {name}\n"
        f"🏰 Town Hall: {th}\n"
        f"🛡 Clan: {clan}\n"
        f"🏆 Trophies: {trophies}\n"
        f"⚔ Heroes: {heroes}"
    )
    await update.message.reply_text(reply)

# Command: /clan <tag>
async def clan(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if len(context.args) != 1:
        return await update.message.reply_text("❗ Usage: /clan <tag>")
    
    tag = context.args[0].strip('#').upper()
    data = get_clan(f"#{tag}")
    if not data or "reason" in data:
        return await update.message.reply_text("⚠️ Clan not found or invalid tag.")

    name = data.get("name")
    desc = data.get("description", "No description")
    members = data.get("members", "?")
    clan_level = data.get("clanLevel", "?")
    points = data.get("clanPoints", "?")

    reply = (
        f"🏰 Clan: {name}\n"
        f"📜 Description: {desc}\n"
        f"🎖 Level: {clan_level}\n"
        f"👥 Members: {members}/50\n"
        f"🏆 Points: {points}"
    )
    await update.message.reply_text(reply)

# Main launcher
def main():
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("player", player))
    app.add_handler(CommandHandler("clan", clan))

    app.run_polling()

if __name__ == "__main__":
    main()
