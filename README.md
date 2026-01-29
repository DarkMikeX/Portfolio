# Portfolio Application

A professional full-stack portfolio application built with React and FastAPI.

## 📁 Project Structure

```
Portfolio/
├── backend/                    # Backend API (FastAPI)
│   ├── app/                   # Main application package
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI application entry point
│   │   ├── core/             # Core configuration and utilities
│   │   │   ├── __init__.py
│   │   │   ├── config.py     # Application settings
│   │   │   ├── database.py   # MongoDB connection
│   │   │   └── logging_config.py
│   │   ├── models/           # Pydantic models
│   │   │   ├── __init__.py
│   │   │   ├── personal_info.py
│   │   │   ├── stats.py
│   │   │   ├── services.py
│   │   │   ├── projects.py
│   │   │   ├── products.py
│   │   │   ├── testimonials.py
│   │   │   ├── skills.py
│   │   │   ├── contact.py
│   │   │   └── status.py
│   │   ├── routes/           # API route handlers
│   │   │   ├── __init__.py
│   │   │   ├── personal_info.py
│   │   │   ├── stats.py
│   │   │   ├── services.py
│   │   │   ├── projects.py
│   │   │   ├── products.py
│   │   │   ├── testimonials.py
│   │   │   ├── skills.py
│   │   │   ├── contact.py
│   │   │   └── status.py
│   │   └── services/          # Business logic (future use)
│   │       └── __init__.py
│   ├── requirements.txt       # Python dependencies
│   └── seed_data.py          # Database seeding script
│
├── frontend/                  # Frontend (React)
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/        # API service layer
│   │   │   └── api.js
│   │   ├── data/            # Mock data (reference)
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utility functions
│   ├── package.json
│   └── public/
│
└── docs/                     # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 16+
- MongoDB (optional, for data persistence)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set environment variables (create `.env` file or export):
```bash
MONGO_URL=mongodb://localhost:27017
DB_NAME=portfolio_db
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

4. Run the server:
```bash
# Using uvicorn directly
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# Or using Python module
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

5. (Optional) Seed the database:
```bash
python seed_data.py
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Start development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## 📡 API Endpoints

All API endpoints are prefixed with `/api`

### Personal Info
- `GET /api/personal-info` - Get personal information
- `PUT /api/personal-info` - Update personal information

### Stats
- `GET /api/stats` - Get all stats
- `POST /api/stats` - Create a stat

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create a service
- `DELETE /api/services/{id}` - Delete a service

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/{id}` - Get a specific project
- `POST /api/projects` - Create a project
- `DELETE /api/projects/{id}` - Delete a project

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create a product
- `DELETE /api/products/{id}` - Delete a product

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `POST /api/testimonials` - Create a testimonial
- `DELETE /api/testimonials/{id}` - Delete a testimonial

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create a skill

### Contact
- `POST /api/contact` - Send a contact message
- `GET /api/contact` - Get all contact messages

### Status
- `GET /api/status` - Get all status checks
- `POST /api/status` - Create a status check

## 📚 API Documentation

Once the backend is running, visit:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## 🏗️ Architecture

### Backend Architecture

The backend follows a clean, modular architecture:

- **Models** (`app/models/`): Pydantic models for data validation
- **Routes** (`app/routes/`): API endpoint handlers
- **Core** (`app/core/`): Configuration, database, and utilities
- **Services** (`app/services/`): Business logic layer (for future expansion)

### Frontend Architecture

- **Components**: React components organized by feature
- **Services**: API service layer for backend communication
- **Hooks**: Custom React hooks for reusable logic
- **Utils**: Utility functions and helpers

## 🔧 Configuration

### Environment Variables

**Backend:**
- `MONGO_URL`: MongoDB connection string (default: `mongodb://localhost:27017`)
- `DB_NAME`: Database name (default: `portfolio_db`)
- `CORS_ORIGINS`: Allowed CORS origins (comma-separated)
- `SERVER_HOST`: Server host (default: `127.0.0.1`)
- `SERVER_PORT`: Server port (default: `8000`)

**Frontend:**
- `REACT_APP_API_URL`: Backend API URL (default: `http://127.0.0.1:8000/api`)

## 📝 Features

- ✅ Full-stack portfolio application
- ✅ RESTful API with FastAPI
- ✅ MongoDB integration with graceful error handling
- ✅ React frontend with modern UI
- ✅ Complete CRUD operations
- ✅ API documentation (Swagger/ReDoc)
- ✅ Professional folder structure
- ✅ Type-safe models with Pydantic
- ✅ CORS support
- ✅ Error handling and logging

## 🧪 Testing

### Backend API Testing

```bash
# Test root endpoint
curl http://127.0.0.1:8000/api/

# Test personal info
curl http://127.0.0.1:8000/api/personal-info

# Test projects
curl http://127.0.0.1:8000/api/projects
```

## 📦 Dependencies

### Backend
- FastAPI - Modern web framework
- Motor - Async MongoDB driver
- Pydantic - Data validation
- Uvicorn - ASGI server
- Python-dotenv - Environment variables

### Frontend
- React - UI library
- Axios - HTTP client
- TailwindCSS - Styling
- Lucide React - Icons

## 🚀 Deployment & Hosting

See **[HOSTING.md](docs/HOSTING.md)** for detailed deployment instructions.

**Quick Start Options:**
- **Railway** (Recommended): All-in-one hosting for frontend + backend
- **Vercel + Render**: Free hosting option (frontend on Vercel, backend on Render)
- **Netlify + Fly.io**: Alternative free hosting with global CDN

**Requirements:**
- MongoDB Atlas (free tier available)
- Environment variables configured
- GitHub repository

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is private and proprietary.

## 👤 Author

Gaurav

---

**Note**: MongoDB is optional. The application works without it but data won't persist between restarts.
