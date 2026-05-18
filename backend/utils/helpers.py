import re
import json
import logging

logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')
logger = logging.getLogger("HireIQ")


def clean_text(text: str) -> str:
    """Removes non-ascii characters and uniformizes spacing."""
    if not text:
        return ""
    # Strip HTML and special non-breaking whitespaces
    text = re.sub(r'<[^>]*>', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def strip_json_markdown(text: str) -> str:
    """Extracts raw JSON content from markdown block syntax."""
    if not text:
        return "{}"
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()
