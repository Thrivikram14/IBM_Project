# IBM_Project
# Task Management Application

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for managing tasks and projects with user authentication using Supabase.

## Features

- User Authentication via Supabase
- Create, Read, Update, and Delete tasks
- Task filtering and sorting capabilities
- Priority-based task management
- Progress tracking
- Comment system for tasks
- Responsive design using Bootstrap
- Redux state management

## Tech Stack

### Frontend
- React.js
- Redux for state management
- Bootstrap for styling
- Axios for API requests
- Supabase for authentication

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose ODM

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- npm or yarn package manager
- Supabase account and project

## Installation

1. Clone the repository
bash
git clone https://github.com/Thrivikram14/IBM_Project
cd task-management-app


2. Install dependencies for both frontend and backend
bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install


3. Environment Setup

Create a .env file in the backend directory:
env
MONGODB_URI=your_mongodb_connection_string
PORT=3001


Create a .env file in the frontend directory:
env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key


## Running the Application

1. Start the backend server
bash
cd backend
npm start


2. Start the frontend application (in a new terminal)
bash
cd frontend
npm start


The application will be available at http://localhost:3000

## API Endpoints

### Tasks
- GET /tasks - Get all tasks
- POST /tasks - Create a new task
- PATCH /tasks/:id - Update a task
- DELETE /tasks/:id - Delete a task
- POST /tasks/:id/comments - Add a comment to a task

## Project Structure


task-management-app/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── slices/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md


## Features in Detail

### Task Management
- Create tasks with title, description, due date, and priority
- Assign tasks to team members
- Set task status (todo, in progress, review, completed)
- Track estimated time and actual time spent
- Add comments and updates to tasks

### Filtering and Sorting
- Filter tasks by status, priority, category, and assigned user
- Sort tasks by due date, priority, or status
- Track task progress with visual indicators

### User Interface
- Responsive design that works on desktop and mobile
- Intuitive navigation and task management
- Progress visualization
- Clean and modern UI using Bootstrap

## Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - Thrivikram V
Project Link: https://github.com/Thrivikram14/IBM_Project

## Acknowledgments

- [React Documentation](https://reactjs.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [Supabase Documentation](https://supabase.io/docs/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)
