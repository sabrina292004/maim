# Event Management System - Backend

## Overview
This is the backend for the Event Management System, built using Node.js, Express, and MongoDB. It provides RESTful API endpoints for managing events, user authentication, and authorization.

## Features
- Create, read, update, and delete events
- User authentication and authorization using JWT
- MongoDB database integration for data persistence

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (local or cloud instance)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the backend directory:
   ```
   cd event-management-system/backend
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Configuration
- Create a `.env` file in the backend directory and add your MongoDB connection string:
  ```
  MONGODB_URI=<your_mongodb_connection_string>
  JWT_SECRET=<your_jwt_secret>
  ```

### Running the Application
To start the server, run:
```
npm start
```
The server will run on `http://localhost:5000`.

### API Endpoints
- **Events**
  - `GET /api/events` - Retrieve all events
  - `POST /api/events` - Create a new event
  - `PUT /api/events/:id` - Update an existing event
  - `DELETE /api/events/:id` - Delete an event

- **Authentication**
  - `POST /api/auth/login` - User login
  - `POST /api/auth/register` - User registration

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.