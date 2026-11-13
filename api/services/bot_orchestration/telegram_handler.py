"""
Telegram Bot Integration & Asynchronous Admin Alerts (AGENTS.md Section 2)
"""
import httpx
from typing import Dict, Any, Optional

async def dispatch_telegram_alert(
    bot_token: str,
    chat_id: str,
    message_markdown: str
) -> bool:
    """Sends immediate asynchronous administrative and agronomist alerts via Telegram"""
    if not bot_token or not chat_id:
        return False

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message_markdown,
        "parse_mode": "Markdown"
    }
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.post(url, json=payload)
            return resp.status_code == 200
    except Exception:
        return False

async def process_telegram_webhook(update: Dict[str, Any]) -> Dict[str, Any]:
    """Processes incoming Telegram updates from farmers"""
    msg = update.get("message", {})
    text = msg.get("text", "")
    from_user = msg.get("from", {})
    first_name = from_user.get("first_name", "Farmer")

    if text.startswith("/start"):
        return {
            "status": "ok",
            "reply": f"🌾 Namaste {first_name}! Welcome to AgriAgent-OS Automated Farm Advisory. Send your crop question or mandi query."
        }
    return {"status": "ok", "reply": "Query received."}

