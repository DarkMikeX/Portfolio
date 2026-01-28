# Project Structure Guide

## Overview

This document explains the professional folder structure of the Portfolio application.

## Backend Structure

### `backend/app/`

Main application package containing all backend code.

#### `app/main.py`
- FastAPI application initialization
- Middleware configuration
- Router registration
- Application lifecycle events

#### `app/core/`
Core functionality and configuration:
- **config.py**: Application settings and environment variables
- **database.py**: MongoDB connection and database utilities
- **logging_config.py**: Logging configuration

#### `app/models/`
Pydantic models for data validation:
- Each file contains models for a specific resource
- Base models for full data representation
- Create models for new record creation
- Update models for partial updates (where applicable)

**Files:**
- `personal_info.py`: Personal information models
- `stats.py`: Statistics models
- `services.py`: Services models
- `projects.py`: Project models
- `products.py`: Product models
- `testimonials.py`: Testimonial models
- `skills.py`: Skill models
- `contact.py`: Contact message models
- `status.py`: Status check models

#### `app/routes/`
API route handlers:
- Each file handles routes for a specific resource
- Uses FastAPI routers for organization
- Implements CRUD operations
- Error handling and validation

**Files:**
- `personal_info.py`: Personal info endpoints
- `stats.py`: Stats endpoints
- `services.py`: Services endpoints
- `projects.py`: Projects endpoints
- `products.py`: Products endpoints
- `testimonials.py`: Testimonials endpoints
- `skills.py`: Skills endpoints
- `contact.py`: Contact endpoints
- `status.py`: Status check endpoints

#### `app/services/`
Business logic layer (prepared for future expansion):
- Currently empty, ready for business logic extraction
- Can contain service classes for complex operations
- Separates business logic from route handlers

### `backend/`
Root backend directory:
- `requirements.txt`: Python dependencies
- `seed_data.py`: Database seeding script
- `.env`: Environment variables (not in repo)

## Frontend Structure

### `frontend/src/`

#### `src/components/`
React components organized by feature:
- `Hero.jsx`: Landing section
- `Navbar.jsx`: Navigation
- `Services.jsx`: Services section
- `Portfolio.jsx`: Projects portfolio
- `Products.jsx`: Products showcase
- `Testimonials.jsx`: Testimonials carousel
- `Contact.jsx`: Contact form
- `Footer.jsx`: Footer section
- `ui/`: Reusable UI components

#### `src/services/`
API service layer:
- `api.js`: Centralized API client with all endpoint functions

#### `src/data/`
- `mock.js`: Mock data (kept for reference)

#### `src/hooks/`
- Custom React hooks
- `use-toast.js`: Toast notification hook

#### `src/lib/`
- Utility functions
- `utils.js`: General utilities

## Benefits of This Structure

### 1. **Separation of Concerns**
- Models, routes, and services are clearly separated
- Easy to locate and modify specific functionality

### 2. **Scalability**
- Easy to add new features
- Clear patterns to follow
- Modular design supports growth

### 3. **Maintainability**
- Related code is grouped together
- Clear file naming conventions
- Easy to understand for new developers

### 4. **Testability**
- Each module can be tested independently
- Clear dependencies
- Mock-friendly structure

### 5. **Professional Standards**
- Follows industry best practices
- Similar to production applications
- Easy to onboard new team members

## File Naming Conventions

- **Python**: snake_case (e.g., `personal_info.py`)
- **JavaScript/React**: camelCase (e.g., `Contact.jsx`)
- **Models**: Singular noun (e.g., `Project`, `Service`)
- **Routes**: Plural noun (e.g., `/projects`, `/services`)

## Import Patterns

### Backend
```python
from app.models.projects import Project, ProjectCreate
from app.core.database import db
from app.core.config import settings
```

### Frontend
```javascript
import { getProjects } from '../services/api';
```

## Adding New Features

### Backend
1. Create model in `app/models/`
2. Create routes in `app/routes/`
3. Register router in `app/main.py`
4. (Optional) Add business logic in `app/services/`

### Frontend
1. Create component in `src/components/`
2. Add API functions in `src/services/api.js`
3. Use component in `App.js`

## Migration from Old Structure

The old `server.py` has been split into:
- Models → `app/models/*.py`
- Routes → `app/routes/*.py`
- Configuration → `app/core/config.py`
- Database → `app/core/database.py`
- Main app → `app/main.py`

All functionality remains the same, just better organized!
