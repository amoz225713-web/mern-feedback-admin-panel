
# MERN Stack Feedback Admin Panel

## Project Description
A web application for managing course feedback. Users can add, view, update, and delete feedback.

## Technologies Used
- MongoDB Atlas
- Express.js
- React.js
- Node.js
- Vite
- Axios

## Project Structure
- backend/ - REST API and database connection
- frontend/ - React user interface

## Requirements
- Node.js and npm
- MongoDB Atlas account

## Installation and Setup

### 1. Clone the repository
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_PROJECT_FOLDER

### 2. Configure the backend
cd backend
npm install

Create a .env file with:
PORT=5000
MONGODB_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING

Start the backend:
npm run dev

### 3. Configure the frontend
Open a second terminal:

cd frontend
npm install

Create a .env file with:
VITE_API_URL=http://localhost:5000/api

Start the frontend:
npm run dev

### 4. Open the application
Visit http://localhost:5173

## Features
- View course feedback
- Add feedback with comments and ratings
- Update existing feedback
- Delete feedback
- Store feedback in MongoDB Atlas
