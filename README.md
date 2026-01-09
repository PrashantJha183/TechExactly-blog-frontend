# MERN Blog Application – Frontend

A **production-grade React frontend** for a MERN Blog Application featuring authentication, role-based access control, posts, comments, and a full Admin Panel.

This frontend is designed to work with a RESTful backend (Node.js + Express + MongoDB) and follows **clean architecture, scalability, and security best practices**.

---

## Project Overview

This application allows:

- Users to read, create, edit, and delete blog posts
- Users to comment on posts
- Admins to manage users, posts, and comments via an admin dashboard

The frontend enforces **authentication, authorization, protected routing, and admin-only access**.

---

## Key Features

### Authentication & Security

- User registration & login
- JWT-based authentication (Access Token)
- Secure session persistence
- Protected routes (Auth & Admin)
- Password visibility toggle
- Axios interceptor for token handling

### Roles & Authorization

- **USER**
  - Create / Edit / Delete own posts
  - Comment on posts
  - Edit/Delete own comments
- **ADMIN**
  - Access Admin Dashboard
  - Manage all users
  - Manage all posts (soft delete)
  - Manage all comments

### Blog Posts

- View all posts (newest → oldest)
- View single post with comments
- Create, edit, delete own posts
- Admin can delete any post
- Soft delete supported

### Comments

- Add comments to posts
- Edit/Delete own comments
- Admin moderation
- Sorted newest → oldest

### Admin Panel

- Dashboard statistics:
  - Total Users
  - Total Posts
  - Total Comments
- Manage Users
- Manage Posts
- Manage Comments
- Fully role-protected UI

---

## Tech Stack

- **React.js (Vite)**
- **React Router v6**
- **Context API (Auth Context)**
- **Axios**
- **Tailwind CSS**
- **JWT Authentication**

---

## Folder Structure

```
src/
├── api/                # Axios & API handlers
├── auth/               # Auth & Admin route guards
├── components/         # Reusable UI components
├── pages/
│   ├── auth/           # Login & Register
│   ├── posts/          # Blog posts
│   ├── comments/       # Comments
│   └── admin/          # Admin dashboard
├── routes/             # App routes
├── tests/              # Jest based testing
└── main.jsx
```

---

## Environment Configuration

Create a `.env` file in the root:

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## Installation & Running

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

---

## Route Protection

| Route              | Access        |
| ------------------ | ------------- |
| `/`                | Public        |
| `/posts/:id`       | Public        |
| `/create-post`     | Authenticated |
| `/edit-post/:id`   | Post Owner    |
| `/admin/dashboard` | Admin         |
| `/admin/users`     | Admin         |
| `/admin/posts`     | Admin         |
| `/admin/comments`  | Admin         |

---

## Testing (Planned)

- Unit tests with Jest
- Integration testing for routes
- API mocking

---

## API Integration

This frontend expects:

- RESTful APIs
- Consistent response structure
- JWT Authorization header
- Role-based access enforced at backend

---

## Production Best Practices Followed

- Clean architecture
- Separation of concerns
- Reusable components
- Centralized API handling
- Scalable routing structure
- Secure authentication handling

---

## Author

**Prashant Jha**  
MERN Stack Developer

---
