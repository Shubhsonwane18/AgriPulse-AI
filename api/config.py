"""
AgriAgent-OS Configuration & Environment Settings
"""
import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgriAgent-OS"
    VERSION: str = "2.0.0"
    API_PREFIX: str = "/api/v1"
    
    # Supabase / Database
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://dpkjhgnhagjzuloxjlqo.supabase.co")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "sb_publishable_dqTh_YtBYhdYyQmDF3gilQ_can4Buw-")
    
    # WhatsApp Cloud API
    WHATSAPP_TOKEN: str = os.getenv("WHATSAPP_TOKEN", "")
    WHATSAPP_PHONE_NUMBER_ID: str = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "")
    WHATSAPP_VERIFY_TOKEN: str = os.getenv("WHATSAPP_VERIFY_TOKEN", "kisanmitra_secure_verify_token")
    WHATSAPP_APP_SECRET: str = os.getenv("WHATSAPP_APP_SECRET", "")
    WHATSAPP_BOT_NUMBER: str = os.getenv("WHATSAPP_BOT_NUMBER", "919876543210")
    
    # Telegram Bot API
    TELEGRAM_BOT_TOKEN: str = os.getenv("TELEGRAM_BOT_TOKEN", "")
    ADMIN_TELEGRAM_CHAT_ID: str = os.getenv("ADMIN_TELEGRAM_CHAT_ID", "")
    
    # Bhashini / MeitY & LLM Keys
    BHASHINI_USER_ID: str = os.getenv("BHASHINI_USER_ID", "")
    BHASHINI_API_KEY: str = os.getenv("BHASHINI_API_KEY", "")
    BHASHINI_PIPELINE_ID: str = os.getenv("BHASHINI_PIPELINE_ID", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Fuel & Market Defaults
    DEFAULT_DIESEL_PRICE: float = 92.5
    DEFAULT_LOADING_FEE_PER_QTL: float = 25.0
    DEFAULT_APMC_CESS_PCT: float = 1.05

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

