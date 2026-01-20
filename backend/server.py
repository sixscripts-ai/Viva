from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from libsql_client import create_client
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

# Turso connection
turso_url = os.environ.get('TURSO_DATABASE_URL')
turso_token = os.environ.get('TURSO_AUTH_TOKEN')

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


# Database Helper
async def get_db():
    client = create_client(turso_url, auth_token=turso_token)
    try:
        yield client
    finally:
        await client.close()

@app.on_event("startup")
async def startup_db():
    if not turso_url:
        print("TURSO_DATABASE_URL not set, skipping DB init")
        return

    client = create_client(turso_url, auth_token=turso_token)
    try:
        # Create Bookings table
        await client.execute("""
            CREATE TABLE IF NOT EXISTS bookings (
                id TEXT PRIMARY KEY,
                client_name TEXT NOT NULL,
                client_email TEXT NOT NULL,
                client_phone TEXT NOT NULL,
                service_type TEXT NOT NULL,
                booking_date TEXT NOT NULL,
                booking_time TEXT NOT NULL,
                message TEXT,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)
        
        # Create Contact Messages table
        await client.execute("""
            CREATE TABLE IF NOT EXISTS contact_messages (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)
    finally:
        await client.close()


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
    booking_obj = Booking(**booking_input.model_dump())
    
    # Convert created_at to ISO string for storage
    created_at_iso = booking_obj.created_at.isoformat()
    
    client = create_client(turso_url, auth_token=turso_token)
    try:
        await client.execute(
            """
            INSERT INTO bookings (id, client_name, client_email, client_phone, service_type, booking_date, booking_time, message, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            [
                booking_obj.id,
                booking_obj.client_name,
                booking_obj.client_email,
                booking_obj.client_phone,
                booking_obj.service_type.value,
                booking_obj.booking_date,
                booking_obj.booking_time,
                booking_obj.message,
                booking_obj.status.value,
                created_at_iso
            ]
        )
    finally:
        await client.close()
        
    return booking_obj


# Protected Admin Routes
@api_router.get("/bookings", response_model=List[Booking])
async def get_bookings(email: str = Depends(verify_token)):
    client = create_client(turso_url, auth_token=turso_token)
    try:
        rs = await client.execute("SELECT * FROM bookings ORDER BY created_at DESC LIMIT 1000")
        
        bookings = []
        for row in rs.rows:
            # Map row to dictionary
            # libsql returns rows that can be accessed by index or name
            # assuming row is a list-like object from create_client
            
            # Note: create_client returns rows as tuples/objects depending on driver version, 
            # usually we need to map columns manually or DictReader style.
            # rs.columns gives column names.
            
            data = {}
            for i, col in enumerate(rs.columns):
                 data[col] = row[i]
            
            # Convert created_at back to datetime
            if isinstance(data.get('created_at'), str):
                data['created_at'] = datetime.fromisoformat(data['created_at'])
            
            bookings.append(Booking(**data))
            
        return bookings
    finally:
        await client.close()


@api_router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str, email: str = Depends(verify_token)):
    client = create_client(turso_url, auth_token=turso_token)
    try:
        rs = await client.execute("SELECT * FROM bookings WHERE id = ?", [booking_id])
        
        if not rs.rows:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        row = rs.rows[0]
        data = {}
        for i, col in enumerate(rs.columns):
             data[col] = row[i]
             
        if isinstance(data.get('created_at'), str):
            data['created_at'] = datetime.fromisoformat(data['created_at'])
            
        return Booking(**data)
    finally:
        await client.close()


@api_router.patch("/bookings/{booking_id}", response_model=Booking)
async def update_booking_status(booking_id: str, update: BookingUpdate, email: str = Depends(verify_token)):
    client = create_client(turso_url, auth_token=turso_token)
    try:
        # Check existence
        check = await client.execute("SELECT id FROM bookings WHERE id = ?", [booking_id])
        if not check.rows:
            raise HTTPException(status_code=404, detail="Booking not found")

        await client.execute(
            "UPDATE bookings SET status = ? WHERE id = ?",
            [update.status.value, booking_id]
        )
        
        # Fetch updated
        rs = await client.execute("SELECT * FROM bookings WHERE id = ?", [booking_id])
        row = rs.rows[0]
        data = {}
        for i, col in enumerate(rs.columns):
             data[col] = row[i]
             
        if isinstance(data.get('created_at'), str):
            data['created_at'] = datetime.fromisoformat(data['created_at'])
            
        return Booking(**data)
    finally:
        await client.close()


@api_router.delete("/bookings/{booking_id}")
async def delete_booking(booking_id: str, email: str = Depends(verify_token)):
    client = create_client(turso_url, auth_token=turso_token)
    try:
        rs = await client.execute("DELETE FROM bookings WHERE id = ?", [booking_id])
        if rs.rows_affected == 0:
             # Note: remote libsql might not always return rows_affected accurately for DELETE depending on protocol,
             # but usually it does. If not, we might need to check existence first.
             # For safety/simplicity we'll assume effectively deleted if no error.
             pass
    finally:
        await client.close()
        
    return {"message": "Booking deleted successfully"}


# Contact Routes
@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(message_input: ContactMessageCreate):
    message_obj = ContactMessage(**message_input.model_dump())
    
    created_at_iso = message_obj.created_at.isoformat()
    
    client = create_client(turso_url, auth_token=turso_token)
    try:
        await client.execute(
            """
            INSERT INTO contact_messages (id, name, email, message, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            [
                message_obj.id,
                message_obj.name,
                message_obj.email,
                message_obj.message,
                created_at_iso
            ]
        )
    finally:
        await client.close()
        
    return message_obj


@api_router.get("/contact", response_model=List[ContactMessage])
async def get_contact_messages(email: str = Depends(verify_token)):
    client = create_client(turso_url, auth_token=turso_token)
    try:
        rs = await client.execute("SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 1000")
        
        messages = []
        for row in rs.rows:
            data = {}
            for i, col in enumerate(rs.columns):
                 data[col] = row[i]
            
            if isinstance(data.get('created_at'), str):
                data['created_at'] = datetime.fromisoformat(data['created_at'])
            
            messages.append(ContactMessage(**data))
            
        return messages
    finally:
        await client.close()


@api_router.delete("/contact/{message_id}")
async def delete_contact_message(message_id: str, email: str = Depends(verify_token)):
    client = create_client(turso_url, auth_token=turso_token)
    try:
        await client.execute("DELETE FROM contact_messages WHERE id = ?", [message_id])
    finally:
        await client.close()
        
    return {"message": "Message deleted successfully"}


# Time Slots Route (Public)
@api_router.get("/available-times")
async def get_available_times(date: str):
    client = create_client(turso_url, auth_token=turso_token)
    try:
        # SQLite queries
        rs = await client.execute(
            "SELECT booking_time FROM bookings WHERE booking_date = ? AND status != 'cancelled'",
            [date]
        )
        
        booked_times = [row[0] for row in rs.rows]
    finally:
        await client.close()
    
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
async def shutdown_app():
    # Cleanup if needed
    pass
