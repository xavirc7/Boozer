from pydantic import BaseModel, Field
from typing import Optional

# Validates payment payloads
class PaymentInitiateRequest(BaseModel):
    session_id: str
    amount: float = Field(..., gt=0)

# # TODO: This is not used
# class PaymentRequest(BaseModel):
#     card_number: str = Field(..., min_length=16, max_length=16)
#     expiry_month: int = Field(..., ge=1, le=12)
#     expiry_year: int = Field(..., ge=2024)
#     cvv: str = Field(..., min_length=3, max_length=4)
#     amount: float = Field(..., gt=0)
#     currency: str = "USD"

class PaymentResponse(BaseModel):
    transaction_id: str
    status: str
    message: str

# Validates incoming webhooks from Nayax/Stripe
class WebhookPayload(BaseModel):
    transaction_id: str
    status: str
    group_id: Optional[str] = None