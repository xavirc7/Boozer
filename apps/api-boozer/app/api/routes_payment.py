from fastapi import APIRouter, HTTPException
from app.schemas.payment_schema import PaymentInitiateRequest, PaymentResponse, WebhookPayload
from app.services.payment_service import payment_service

router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)

@router.post("/initiate", response_model=PaymentResponse)
async def initiate_payment(payment_request: PaymentInitiateRequest):
    """
    Called by the frontend when a player reaches the payment screen.
    This route tells the physical card reader to wake up and charge the amount.
    """
    try:
        txn_id = await payment_service.start_session(payment_request.amount)
        
        return PaymentResponse(
            transaction_id=txn_id,
            status="pending",
            message="Please tap your card on the terminal."
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to connect to card reader: {str(e)}")


@router.post("/webhook")
async def payment_webhook(payload: WebhookPayload):
    """
    Called automatically by your payment provider when the bank approves/declines. 
    """

    try:
        result = await payment_service.handle_webhook_event(
            transaction_id=payload.transaction_id,
            status=payload.status,
            item_id=payload.item_id
        )
        return result
    
    except ValueError as e:
        error_msg = str(e)
        if error_msg == "Payment declined by bank.":
            raise HTTPException(status_code=402, detail=error_msg)
        else:
            raise HTTPException(status_code=400, detail=error_msg)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error handling webhook.")