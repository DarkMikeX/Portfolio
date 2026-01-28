# API Endpoints Documentation

Complete API reference for all portfolio endpoints.

## Base URL
```
http://127.0.0.1:8000/api
```

## Endpoints by Component

### 1. Navbar Component
**Endpoint:** `GET /api/nav-links`
- Returns navigation links for the navbar
- Response: Array of navigation links with `label`, `href`, and `order`

**Example Response:**
```json
[
  {"id": "1", "label": "Home", "href": "#home", "order": 0},
  {"id": "2", "label": "Services", "href": "#services", "order": 1},
  {"id": "3", "label": "Portfolio", "href": "#portfolio", "order": 2},
  {"id": "4", "label": "Products", "href": "#products", "order": 3},
  {"id": "5", "label": "Testimonials", "href": "#testimonials", "order": 4},
  {"id": "6", "label": "Contact", "href": "#contact", "order": 5}
]
```

### 2. Hero Component
**Endpoints:**
- `GET /api/personal-info` - Personal information
- `GET /api/stats` - Statistics

**Personal Info Response:**
```json
{
  "id": "...",
  "name": "Mikey",
  "nickname": "Mikey",
  "title": "Full-Stack Developer",
  "tagline": "With great code comes great responsibility",
  "description": "...",
  "email": "mike@urmikexd.me",
  "phone": "+1 (555) 123-4567",
  "location": "New York City, NY",
  "avatar": "https://...",
  "resume": "#",
  "socials": {
    "github": "https://github.com",
    "linkedin": "https://linkedin.com",
    "twitter": "https://twitter.com",
    "dribbble": "https://dribbble.com"
  }
}
```

**Stats Response:**
```json
[
  {"id": "1", "value": "5+", "label": "Years Experience", "order": 0},
  {"id": "2", "value": "120+", "label": "Projects Completed", "order": 1},
  {"id": "3", "value": "50+", "label": "Happy Clients", "order": 2},
  {"id": "4", "value": "99%", "label": "Success Rate", "order": 3}
]
```

### 3. Services Component
**Endpoint:** `GET /api/services`
- Returns all services offered

**Response:**
```json
[
  {
    "id": "1",
    "title": "Web Development",
    "description": "Building responsive, high-performance websites...",
    "icon": "Globe"
  },
  ...
]
```

### 4. Portfolio Component
**Endpoints:**
- `GET /api/projects` - Get all projects
- `GET /api/projects/{id}` - Get specific project

**Response:**
```json
[
  {
    "id": "1",
    "title": "E-Commerce Platform",
    "description": "A full-featured online store...",
    "image": "https://...",
    "category": "Web Development",
    "technologies": ["React", "Node.js", "MongoDB", "Stripe"],
    "link": "#",
    "github": "#"
  },
  ...
]
```

### 5. Products Component
**Endpoint:** `GET /api/products`
- Returns all digital products

**Response:**
```json
[
  {
    "id": "1",
    "title": "React Component Library",
    "description": "50+ customizable UI components...",
    "price": 49,
    "originalPrice": 79,
    "image": "https://...",
    "category": "Code",
    "rating": 4.9,
    "downloads": 2500
  },
  ...
]
```

### 6. Testimonials Component
**Endpoint:** `GET /api/testimonials`
- Returns all client testimonials

**Response:**
```json
[
  {
    "id": "1",
    "name": "Sarah Johnson",
    "role": "CEO, TechStart Inc.",
    "avatar": "https://...",
    "content": "Mikey delivered an exceptional...",
    "rating": 5
  },
  ...
]
```

### 7. Contact Component
**Endpoints:**
- `GET /api/personal-info` - Contact information
- `GET /api/skills` - Skills for display
- `POST /api/contact` - Submit contact form

**Skills Response:**
```json
[
  {"id": "...", "name": "React / Next.js", "level": 95},
  {"id": "...", "name": "Node.js / Express", "level": 90},
  ...
]
```

**Contact Form Submission:**
```json
POST /api/contact
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'm interested in working with you..."
}
```

### 8. Footer Component
**Endpoints:**
- `GET /api/personal-info` - Personal info for footer
- `GET /api/nav-links` - Navigation links for footer

## Complete Endpoint List

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
- `GET /api/projects/{id}` - Get specific project
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
- `POST /api/contact` - Submit contact message
- `GET /api/contact` - Get all contact messages (admin)

### Navigation Links
- `GET /api/nav-links` - Get all navigation links
- `POST /api/nav-links` - Create a navigation link
- `DELETE /api/nav-links/{id}` - Delete a navigation link

### Status
- `GET /api/status` - Get all status checks
- `POST /api/status` - Create a status check

## Error Responses

All endpoints return standard HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "detail": "Error message here"
}
```

## Interactive API Documentation

Visit `http://127.0.0.1:8000/docs` for interactive Swagger UI documentation.
