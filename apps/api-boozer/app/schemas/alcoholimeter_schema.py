from pydantic import BaseModel, Field

class AlcoholTestRequest(BaseModel):
    transaction_id: str = Field(..., description="The ID of the successful payment")

class AlcoholTestResponse(BaseModel):
    test_id: str
    transaction_id: str
    status: str
    bac_level: float = Field(..., description="Blood Alcohol Content")
    message: str