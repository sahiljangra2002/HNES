"""Provider-agnostic email notifications.

Emails activate automatically once credentials are added to backend/.env:
  - SendGrid : set SENDGRID_API_KEY + SENDER_EMAIL (verified sender)
  - SMTP     : set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SENDER_EMAIL
All submissions are ALWAYS stored in MongoDB regardless of email status.
"""
import asyncio
import logging
import os
from email.message import EmailMessage

logger = logging.getLogger("mailer")


def _env(key: str, default: str = "") -> str:
    return (os.environ.get(key) or default).strip()


def email_configured() -> str:
    """Returns 'sendgrid', 'smtp' or '' if not configured."""
    if _env("SENDGRID_API_KEY"):
        return "sendgrid"
    if _env("SMTP_HOST") and _env("SMTP_USER"):
        return "smtp"
    return ""


async def _send_via_sendgrid(subject: str, html: str, to_email: str) -> tuple:
    import requests

    api_key = _env("SENDGRID_API_KEY")
    sender = _env("SENDER_EMAIL") or to_email
    payload = {
        "personalizations": [{"to": [{"email": to_email}]}],
        "from": {"email": sender, "name": "Human & Natural Environment Society Website"},
        "subject": subject,
        "content": [{"type": "text/html", "value": html}],
    }

    def _post():
        return requests.post(
            "https://api.sendgrid.com/v3/mail/send",
            json=payload,
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=15,
        )

    resp = await asyncio.get_event_loop().run_in_executor(None, _post)
    if resp.status_code in (200, 201, 202):
        return True, "sent"
    return False, f"sendgrid_error_{resp.status_code}"


async def _send_via_smtp(subject: str, html: str, to_email: str) -> tuple:
    import aiosmtplib

    sender = _env("SENDER_EMAIL") or _env("SMTP_USER")
    msg = EmailMessage()
    msg["From"] = sender
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.set_content("This notification requires an HTML-capable email client.")
    msg.add_alternative(html, subtype="html")
    port = int(_env("SMTP_PORT", "587"))
    await aiosmtplib.send(
        msg,
        hostname=_env("SMTP_HOST"),
        port=port,
        username=_env("SMTP_USER"),
        password=_env("SMTP_PASS"),
        start_tls=(port == 587),
        use_tls=(port == 465),
        timeout=20,
    )
    return True, "sent"


async def send_notification(subject: str, html: str) -> tuple:
    """Send a notification email to NOTIFY_EMAIL. Returns (sent, detail)."""
    to_email = _env("NOTIFY_EMAIL")
    provider = email_configured()
    if not provider or not to_email:
        logger.info("Email not configured - notification stored in DB only (%s)", subject)
        return False, "not_configured"
    try:
        if provider == "sendgrid":
            return await _send_via_sendgrid(subject, html, to_email)
        return await _send_via_smtp(subject, html, to_email)
    except Exception as exc:  # noqa: BLE001
        logger.error("Email send failed: %s", exc)
        return False, f"error: {exc}"


def submission_email_html(sub: dict) -> str:
    rows = ""
    labels = {
        "name": "Name", "email": "Email", "phone": "Phone", "city": "City",
        "interest": "Area of Interest", "organization": "Organization",
        "subject": "Subject", "message": "Message",
    }
    for key, label in labels.items():
        value = sub.get(key)
        if value:
            rows += f"<tr><td style='padding:6px 12px;font-weight:bold'>{label}</td><td style='padding:6px 12px'>{value}</td></tr>"
    kind = sub.get("type", "contact").title()
    return f"""
    <div style='font-family:Arial,sans-serif;max-width:600px'>
      <h2 style='color:#2d4a3a'>New {kind} Submission - Website</h2>
      <table style='border-collapse:collapse;background:#faf7f2;border:1px solid #e5ded2;width:100%'>{rows}</table>
      <p style='color:#777;font-size:12px'>Human &amp; Natural Environment Society - website notification.
      Received at {sub.get('created_at', '')}.</p>
    </div>
    """
