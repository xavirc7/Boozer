from fastapi import APIRouter, HTTPException
from app.schemas.alcoholimeter_schema import AlcoholTestRequest, AlcoholTestResponse
from app.services.alcoholimeter_service import alcoholimeter_service

router = APIRouter(
    prefix="/hardware",
    tags=["Hardware Integration"]
)

# Routes
@router.post("/alcoholimeter/start", response_model=AlcoholTestResponse)
async def start_alcohol_test(request: AlcoholTestRequest):
    """
    Called by the frontend after payment succeeds to turn on the machine.
    """
    try:
        result = await alcoholimeter_service.run_test(request.transaction_id)
        
        return AlcoholTestResponse(
            test_id=result["test_id"],
            transaction_id=request.transaction_id,
            status="completed",
            bac_level=result["bac_level"],
            message="Test completed successfully."
        )
    except PermissionError as e:
        # Returns 402 Payment Required if they try to blow without paying
        raise HTTPException(status_code=402, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hardware error: {str(e)}")