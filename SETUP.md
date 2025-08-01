# NCA IT Solution - Company Management Web Application

This is a full-stack web application with React frontend and Node.js backend for company management.

## Project Structure
- `/frontend` - React application with Vite
- `/backend` - Node.js/Express API server

## Setup Instructions

### Prerequisites
1. Node.js (v14 or higher)
2. MongoDB (local or cloud instance)
3. Git

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```env
   PORT=1234
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   The backend will run on http://localhost:1234

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/user/login` - User login
- `POST /api/user/create-admin` - Create admin user
- `POST /api/user/create-student` - Create student user

## Features
- User authentication (Admin/Student roles)
- **Role-based routing and access control**
- Secure password hashing with bcrypt
- JWT token-based authentication
- Cookie-based session management
- CORS-enabled API
- Responsive UI with Tailwind CSS
- Protected routes with automatic redirection

## Usage
1. Open your browser and navigate to http://localhost:5173
2. Click the "Login" button to open the login modal
3. Enter your credentials (userId and password)
4. The system will authenticate against the backend API
5. **Users will be automatically redirected based on their role:**
   - **Admin users** → redirected to `/admin`
   - **Student users** → redirected to `/student`

## Testing Role-Based Routing

### Creating Test Users
1. Ensure your backend server is running
2. Run the test user creation script:
   ```bash
   cd "c:\Users\Arun Goel\OneDrive\Desktop\NCA APP\Company_Management_Web-NCA-IT-SOLUTION-"
   node create-test-users.js
   ```

### Test Credentials
After running the script, you can test with:

**Admin Account:**
- User ID: `admin`
- Password: `admin123`
- Will redirect to: `/admin`

**Student Account:**
- User ID: `student`
- Password: `student123`
- Will redirect to: `/student`

### Protected Routes
- `/admin` - Only accessible by admin users
- `/student` - Only accessible by student users
- Unauthorized users are automatically redirected to their appropriate dashboard
- Unauthenticated users are redirected to the homepage

## Development Notes
- Backend API runs on port 1234
- Frontend development server runs on port 5173
- CORS is configured to allow requests from the frontend
- Authentication tokens are stored in localStorage and cookies

## Technologies Used
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **Other**: CORS, cookie-parser, nodemailer
