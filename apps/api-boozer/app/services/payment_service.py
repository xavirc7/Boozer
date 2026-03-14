import uuid
import logging

# Mock Database to store transaction states
transaction_db = {}

logger = logging.getLogger(__name__)

class PaymentService:
    async def start_session(self, amount: float) -> str:
        logger.info(f"Initiating payment session for amount: {amount}")
        # TODO: Replace with real SDK call (e.g., Stripe Terminal or Nayax API)
        mock_transaction_id = f"txn_{uuid.uuid4().hex[:12]}"
        
        transaction_db[mock_transaction_id] = "pending"
        # TODO: START SENSOR
        return mock_transaction_id
    
    async def handle_webhook_event(self, transaction_id: str, status: str) -> dict:
        if status == "approved":
            transaction_db[transaction_id] = "paid"
            logger.info(f"SUCCESS: Transaction {transaction_id} marked as paid")
            return {"status": "success", "message": "Payment verified. Ready for test."}
            
        elif status == "declined":
            logger.warning(f"DECLINED: Transaction {transaction_id} failed.")
            raise ValueError("Payment declined by bank.")
            
        else:
            logger.error(f"UNKNOWN STATUS: {status} for transaction {transaction_id}")
            raise ValueError("Unknown payment status.")

payment_service = PaymentService()