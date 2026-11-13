"""
Bot Orchestration Module (WhatsApp, Telegram & Intent Routing)
"""
from .message_router import route_farmer_message, BotResponse
from .telegram_handler import dispatch_telegram_alert, process_telegram_webhook

__all__ = [
    "route_farmer_message",
    "BotResponse",
    "dispatch_telegram_alert",
    "process_telegram_webhook",
]

