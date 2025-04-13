from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field
import requests
import google.generativeai as genai
from typing import List, Optional
import os
from dotenv import load_dotenv
import logging
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hugging Face configuration
HF_API_URL = os.getenv("HF_API_URL")
HF_API_TOKEN = os.getenv("HF_API_TOKEN")

# Gemini configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

class SoilParameters(BaseModel):
    pH: float = Field(..., ge=0, le=14)
    nitrogen: float = Field(..., ge=0)
    phosphorus: float = Field(..., ge=0)
    potassium: float = Field(..., ge=0)
    moisture: float = Field(..., ge=0, le=100)
    temperature: float = Field(..., ge=-50, le=100)
    humidity: float = Field(..., ge=0, le=100)
    cropType: str

class FertilizerRecommendation(BaseModel):
    fertilizer: str
    applicationRate: str
    additionalSuggestions: List[str]
    confidence: float
    timestamp: datetime

class User(BaseModel):
    username: str
    email: str
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class SoilData(BaseModel):
    nitrogen: str
    phosphorus: str
    potassium: str
    ph: str
    rainfall: str
    temperature: str
    humidity: str
    soilType: str
    prediction: Optional[dict] = None

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except jwt.JWTError:
        raise credentials_exception
    return token_data

@app.post("/api/predict", response_model=FertilizerRecommendation)
async def predict(
    soil_params: SoilParameters,
    current_user: TokenData = Depends(get_current_user)
):
    try:
        # Validate input parameters
        if not HF_API_URL or not HF_API_TOKEN:
            raise HTTPException(
                status_code=500,
                detail="Hugging Face API configuration missing"
            )

        # Prepare input for Hugging Face model
        input_data = {
            "inputs": {
                "pH": soil_params.pH,
                "nitrogen": soil_params.nitrogen,
                "phosphorus": soil_params.phosphorus,
                "potassium": soil_params.potassium,
                "moisture": soil_params.moisture,
                "temperature": soil_params.temperature,
                "humidity": soil_params.humidity,
                "cropType": soil_params.cropType
            }
        }

        # Call Hugging Face API
        headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
        response = requests.post(HF_API_URL, json=input_data, headers=headers)
        
        if response.status_code != 200:
            logger.error(f"Hugging Face API error: {response.text}")
            raise HTTPException(
                status_code=response.status_code,
                detail="Error calling Hugging Face API"
            )

        prediction = response.json()
        
        # Process prediction
        fertilizer = prediction.get("fertilizer", "Unknown")
        application_rate = prediction.get("application_rate", "Unknown")
        confidence = prediction.get("confidence", 0.0)

        # Get additional suggestions using Gemini
        try:
            prompt = f"""
            Based on these soil parameters:
            pH: {soil_params.pH}
            Nitrogen: {soil_params.nitrogen} ppm
            Phosphorus: {soil_params.phosphorus} ppm
            Potassium: {soil_params.potassium} ppm
            Moisture: {soil_params.moisture}%
            Temperature: {soil_params.temperature}°C
            Humidity: {soil_params.humidity}%
            Crop Type: {soil_params.cropType}

            And the recommended fertilizer: {fertilizer}
            Application rate: {application_rate}

            Provide 3 specific, actionable suggestions for optimal fertilizer application and soil management.
            """
            
            response = model.generate_content(prompt)
            suggestions = response.text.split('\n')[:3]  # Get first 3 suggestions
        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            suggestions = [
                "Monitor soil moisture regularly",
                "Consider weather conditions for application",
                "Consult with local agricultural expert"
            ]

        return FertilizerRecommendation(
            fertilizer=fertilizer,
            applicationRate=application_rate,
            additionalSuggestions=suggestions,
            confidence=confidence,
            timestamp=datetime.utcnow()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your request"
        )

@app.post("/api/generate-report")
async def generate_report(data: SoilData):
    try:
        # Create a detailed prompt for the report
        prompt = f"""
        Generate a detailed agricultural report based on the following soil parameters:
        
        Soil Parameters:
        - Soil Type: {data.soilType}
        - pH Level: {data.ph}
        - Nitrogen Content: {data.nitrogen} mg/kg
        - Phosphorus Content: {data.phosphorus} mg/kg
        - Potassium Content: {data.potassium} mg/kg
        - Rainfall: {data.rainfall} mm
        - Temperature: {data.temperature}°C
        - Humidity: {data.humidity}%
        
        {f'Recommended Fertilizer: {data.prediction["fertilizer"]}' if data.prediction else ''}
        {f'Application Rate: {data.prediction["applicationRate"]}' if data.prediction else ''}
        
        Please provide:
        1. Soil Health Analysis
        2. Nutrient Balance Assessment
        3. Environmental Conditions Impact
        4. Fertilizer Recommendations and Application Strategy
        5. Best Practices for Soil Management
        6. Potential Risks and Mitigation Strategies
        
        Format the report in a clear, professional structure with headings and bullet points where appropriate.
        """

        # Generate the report using Gemini
        response = model.generate_content(prompt)
        
        # Check if the response was blocked
        if response.prompt_feedback.block_reason:
            raise HTTPException(status_code=400, detail="Content generation was blocked")

        return {"report": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api")
def read_root():
    return {"message": "Soil Sync API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 