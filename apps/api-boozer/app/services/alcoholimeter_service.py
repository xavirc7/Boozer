import uuid
import asyncio
import logging
import serial
from app.services.payment_service import transaction_db

logger = logging.getLogger(__name__)

class AlcoholimeterService:
    def __init__(self):
        self.port = "/dev/ttyUSB0"
        self.baudrate = 9600
        
        try:
            self.serial_conn = serial.Serial(self.port, self.baudrate, timeout=1)
            logger.info(f"Connected to hardware on {self.port}")
        except serial.SerialException as e:
            logger.error(f"Failed to connect to alcoholimeter on {self.port}: {e}")
            self.serial_conn = None
    
    def _read_from_physical_sensor(self) -> float:
        """
        synchronous, blocking function that talks to the hardware.
        """
        if not self.serial_conn:
            raise ConnectionError("Hardware not connected.")

        # TODO: Check hardware for the exact start byte command)
        self.serial_conn.write(b"START_TEST\n")

        self.serial_conn.timeout = 30 
        
        # 3. Wait and read the response from the machine
        # Assume the machine sends back a string like: "RESULT:0.045\r\n"
        raw_bytes = self.serial_conn.readline()
        
        if not raw_bytes:
            raise TimeoutError("User took too long to blow or sensor timed out.")

        raw_data = raw_bytes.decode('utf-8').strip()
        
        # TODO: Check hardware's manual
        if raw_data.startswith("RESULT:"):
            bac_value = float(raw_data.split(":")[1])
            return bac_value
        else:
            raise ValueError(f"Unexpected data from sensor: {raw_data}")

    def _mock_read_from_physical_sensor(self) -> float:

        return 1.5
    
    async def run_test(self, transaction_id: str) -> dict:
        # verify payment
        payment_status = transaction_db.get(transaction_id)
        if payment_status != "paid":
            logger.error(f"Attempted test without payment. Txn: {transaction_id}")
            raise PermissionError("Valid payment required to start test.")
        
        # run hardware
        test_id = f"alc_{uuid.uuid4().hex[:8]}"
        logger.info(f"Payment verified. Waking up alcoholimeter. Test ID: {test_id}")
        
        try:
            # bac_level = await asyncio.to_thread(self._read_from_physical_sensor)
            bac_level = await asyncio.to_thread(self._mock_read_from_physical_sensor)
        except Exception as e:
            logger.error(f"Test failed: {str(e)}")
            raise RuntimeError(f"Hardware failure: {str(e)}")
        
        transaction_db[transaction_id] = "consumed"        
        logger.info(f"Test {test_id} complete. BAC: {bac_level}.")
        
        return {
            "test_id": test_id,
            "bac_level": bac_level
        }

alcoholimeter_service = AlcoholimeterService()