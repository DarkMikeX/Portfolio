# Migration Guide: Old to New Structure

## What Changed

The backend has been reorganized from a single `server.py` file into a professional, modular structure.

## Old Structure

```
backend/
└── server.py  (All code in one file)
```

## New Structure

```
backend/
├── app/
│   ├── main.py
│   ├── core/
│   ├── models/
│   ├── routes/
│   └── services/
└── seed_data.py
```

## Changes Summary

### 1. Models Extracted
- All Pydantic models moved to `app/models/`
- Each resource has its own file
- Better organization and maintainability

### 2. Routes Separated
- All route handlers moved to `app/routes/`
- Each resource has its own route file
- Clear separation of concerns

### 3. Configuration Centralized
- Settings moved to `app/core/config.py`
- Database connection in `app/core/database.py`
- Logging configuration in `app/core/logging_config.py`

### 4. Main Application
- FastAPI app initialization in `app/main.py`
- Router registration
- Middleware setup

## Running the Application

### Old Way (Still Works)
```bash
python -m uvicorn server:app --host 127.0.0.1 --port 8000
```

### New Way (Recommended)
```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

## API Endpoints

**No changes to API endpoints!** All endpoints remain the same:
- `/api/personal-info`
- `/api/projects`
- `/api/services`
- etc.

## Frontend

**No changes required!** The frontend continues to work exactly as before.

## Benefits

1. **Better Organization**: Code is logically grouped
2. **Easier Maintenance**: Find and fix issues faster
3. **Scalability**: Easy to add new features
4. **Professional**: Follows industry standards
5. **Team Collaboration**: Multiple developers can work on different modules

## Backward Compatibility

The old `server.py` file is still present but deprecated. The new structure is fully functional and recommended for use.
