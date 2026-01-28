# Architecture Documentation

## Overview

This portfolio application follows a clean, modular architecture with clear separation of concerns.

## Backend Architecture

### Directory Structure

```
backend/app/
├── main.py              # Application entry point
├── core/                # Core functionality
│   ├── config.py       # Configuration management
│   ├── database.py     # Database connection
│   └── logging_config.py
├── models/             # Data models (Pydantic)
├── routes/             # API route handlers
└── services/           # Business logic (future)
```

### Components

#### 1. Core Module (`app/core/`)

**config.py**
- Centralized configuration management
- Environment variable handling
- Settings class with type hints

**database.py**
- MongoDB connection setup
- Database client initialization
- Connection cleanup utilities

**logging_config.py**
- Logging configuration
- Logger setup

#### 2. Models (`app/models/`)

Each model file contains:
- **Base Model**: Full data model with all fields
- **Create Model**: Model for creating new records (without auto-generated fields)
- **Update Model**: Optional fields for updates (where applicable)

Models use Pydantic for:
- Data validation
- Type checking
- Serialization/deserialization

#### 3. Routes (`app/routes/`)

Each route file:
- Defines API endpoints for a specific resource
- Handles HTTP requests/responses
- Uses dependency injection
- Implements error handling

Route structure:
```python
router = APIRouter(prefix="/resource", tags=["resource"])

@router.get("", response_model=List[Model])
async def get_resources():
    # Implementation
```

#### 4. Main Application (`app/main.py`)

- FastAPI app initialization
- Middleware configuration (CORS)
- Router registration
- Event handlers (shutdown)

## Frontend Architecture

### Directory Structure

```
frontend/src/
├── components/         # React components
├── services/          # API service layer
├── hooks/             # Custom hooks
├── lib/               # Utilities
└── data/              # Mock data (reference)
```

### Components

#### 1. Components (`src/components/`)

- **Hero.jsx**: Landing section with personal info
- **Services.jsx**: Services showcase
- **Portfolio.jsx**: Projects portfolio
- **Products.jsx**: Digital products
- **Testimonials.jsx**: Client testimonials
- **Contact.jsx**: Contact form and info
- **Navbar.jsx**: Navigation bar
- **Footer.jsx**: Footer section

#### 2. Services (`src/services/`)

**api.js**: Centralized API client
- Axios instance configuration
- Request/response interceptors
- API endpoint functions
- Error handling

#### 3. Data Flow

```
Component → API Service → Backend API → MongoDB
     ↓                                        ↓
  State Update                          Data Response
```

## Data Flow

### Request Flow

1. **Frontend**: User interaction triggers API call
2. **API Service**: Axios sends HTTP request
3. **Backend Route**: Receives request, validates data
4. **Database**: Query/update MongoDB
5. **Response**: Data returned through layers
6. **Frontend**: State updated, UI re-renders

### Error Handling

- **Frontend**: Try-catch blocks, error states
- **Backend**: HTTPException for API errors
- **Database**: Graceful fallback when MongoDB unavailable

## Database Schema

### Collections

- `personal_info`: Single document with personal information
- `stats`: Array of statistics
- `services`: Array of services offered
- `projects`: Array of portfolio projects
- `products`: Array of digital products
- `testimonials`: Array of client testimonials
- `skills`: Array of skills with proficiency levels
- `contact_messages`: Array of contact form submissions
- `status_checks`: Array of status check records

## Security Considerations

1. **CORS**: Configured to allow specific origins
2. **Input Validation**: Pydantic models validate all inputs
3. **Error Messages**: Generic error messages to prevent information leakage
4. **Environment Variables**: Sensitive data in environment variables

## Scalability

### Current Architecture Supports:

- Horizontal scaling (stateless API)
- Database sharding (MongoDB)
- Microservices migration (modular structure)
- Caching layer addition (services module)

### Future Enhancements:

- Authentication/Authorization
- Rate limiting
- Caching (Redis)
- Background tasks (Celery)
- File upload handling
- Email notifications

## Performance Optimizations

1. **Async/Await**: All database operations are async
2. **Connection Pooling**: MongoDB connection pooling
3. **Lazy Loading**: Frontend components load data on demand
4. **Error Boundaries**: React error boundaries for graceful failures

## Testing Strategy

### Backend
- Unit tests for models
- Integration tests for routes
- Database tests with test database

### Frontend
- Component tests
- API service tests
- E2E tests

## Deployment Considerations

1. **Environment Variables**: All configurable values in env vars
2. **Database**: MongoDB connection string for production
3. **CORS**: Update allowed origins for production domain
4. **Static Files**: Frontend build served separately
5. **Logging**: Production logging configuration
