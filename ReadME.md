# Team Task Manager

Team Task Manager is a full-stack web application that helps teams create projects, assign tasks, and track work progress. The system includes role-based access control where admins can manage projects, team members, and tasks, while members can view assigned work and update task status.

## Features

- User signup and login
- JWT-based authentication
- Role-based access control
- Admin and member roles
- Project creation and management
- Team member assignment
- Task creation and assignment
- Task status tracking
- Dashboard with task statistics
- Overdue task tracking
- REST API integration
- MongoDB database support
- Fully responsive user interface

## User Roles

### Admin

Admin users can:

- Create new projects
- Add members to projects
- Create tasks
- Assign tasks to members
- Update task details
- Delete projects
- Delete tasks
- View all projects and tasks
- Track overall progress from the dashboard

### Member

Member users can:

- View assigned projects
- View assigned tasks
- Update task status
- Track personal task progress

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- bcrypt.js

### Deployment

- Railway

## Folder Structure

`txt
team-task-manager/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
│
└── README.md
