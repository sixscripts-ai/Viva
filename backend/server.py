from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from enum import Enum
from jose import JWTError, jwt
from passlib.context import CryptContext

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Auth configuration
SECRET_KEY = os.environ.get('JWT_SECRET', 'diesel-media-secret-key-2025')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Admin credentials (hardcoded as requested)
ADMIN_EMAIL = "aschtion2@gmail.com"
ADMIN_PASSWORD_HASH = pwd_context.hash("Dieselmedia")


# Enums
class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class ServiceType(str, Enum):
    WEDDING = "wedding"
    EVENT = "event"
    COMMERCIAL = "commercial"
    SOCIAL_MEDIA = "social_media"
    REAL_ESTATE = "real_estate"


# Auth Models
class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    email: str


# Models
class BookingCreate(BaseModel):
    client_name: str = Field(..., min_length=2)
    client_email: EmailStr
    client_phone: str = Field(..., min_length=10)
    service_type: ServiceType
    booking_date: str  # ISO date string
    booking_time: str
    message: Optional[str] = None


class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    client_email: str
    client_phone: str
    service_type: ServiceType
    booking_date: str
    booking_time: str
    message: Optional[str] = None
    status: BookingStatus = BookingStatus.PENDING
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class BookingUpdate(BaseModel):
    status: BookingStatus


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    message: str = Field(..., min_length=1)


# Auth Helper Functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# Auth Routes
@api_router.post("/auth/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    if request.email != ADMIN_EMAIL:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not pwd_context.verify(request.password, ADMIN_PASSWORD_HASH):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": request.email})
    return TokenResponse(access_token=access_token, email=request.email)


@api_router.get("/auth/verify")
async def verify_auth(email: str = Depends(verify_token)):
    return {"authenticated": True, "email": email}


# Routes
@api_router.get("/")
async def root():
    return {"message": "Diesel Media API"}


# Booking Routes (Public)
@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking_input: BookingCreate):
    booking_data = booking_input.model_dump()
    booking_obj = Booking(**booking_data)
    
    doc = booking_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.bookings.insert_one(doc)
    return booking_obj


# Protected Admin Routes
@api_router.get("/bookings", response_model=List[Booking])
async def get_bookings(email: str = Depends(verify_token)):
    bookings = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for booking in bookings:
        if isinstance(booking.get('created_at'), str):
            booking['created_at'] = datetime.fromisoformat(booking['created_at'])
    
    return bookings


@api_router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str, email: str = Depends(verify_token)):
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if isinstance(booking.get('created_at'), str):
        booking['created_at'] = datetime.fromisoformat(booking['created_at'])
    
    return booking


@api_router.patch("/bookings/{booking_id}", response_model=Booking)
async def update_booking_status(booking_id: str, update: BookingUpdate, email: str = Depends(verify_token)):
    result = await db.bookings.update_one(
        {"id": booking_id},
        {"$set": {"status": update.status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if isinstance(booking.get('created_at'), str):
        booking['created_at'] = datetime.fromisoformat(booking['created_at'])
    
    return booking


@api_router.delete("/bookings/{booking_id}")
async def delete_booking(booking_id: str, email: str = Depends(verify_token)):
    result = await db.bookings.delete_one({"id": booking_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"message": "Booking deleted successfully"}


# Contact Routes
@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(message_input: ContactMessageCreate):
    message_data = message_input.model_dump()
    message_obj = ContactMessage(**message_data)
    
    doc = message_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.contact_messages.insert_one(doc)
    return message_obj


@api_router.get("/contact", response_model=List[ContactMessage])
async def get_contact_messages(email: str = Depends(verify_token)):
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for msg in messages:
        if isinstance(msg.get('created_at'), str):
            msg['created_at'] = datetime.fromisoformat(msg['created_at'])
    
    return messages


@api_router.delete("/contact/{message_id}")
async def delete_contact_message(message_id: str, email: str = Depends(verify_token)):
    result = await db.contact_messages.delete_one({"id": message_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Message deleted successfully"}


# Time Slots Route (Public)
@api_router.get("/available-times")
async def get_available_times(date: str):
    bookings = await db.bookings.find(
        {"booking_date": date, "status": {"$ne": "cancelled"}},
        {"_id": 0, "booking_time": 1}
    ).to_list(100)
    
    booked_times = [b["booking_time"] for b in bookings]
    
    all_times = [
        "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
        "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
    ]
    
    available_times = [t for t in all_times if t not in booked_times]
    return {"available_times": available_times, "booked_times": booked_times}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
