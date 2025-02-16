# Movie Ticket Booking API

This project is a REST API for movie ticket purchasing and viewing history management.

## 🚀 Features

- Movie and session management
- Ticket purchasing and validation
- Viewing history tracking
- Redis caching
- JWT based authentication
- MongoDB database
- Docker support

## 🛠️ Technologies

- NestJS
- MongoDB
- Redis
- Docker
- JWT
- TypeScript

## 🔧 Installation
### Docker Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/movie-ticket-booking-api.git
cd movie-ticket-booking-api
```

2. Build the Docker image:

```bash
docker-compose build
```

3. Start the Docker containers:

```bash
docker-compose up
```

4. Access the API at `http://localhost:80`


### Running the Application


### Requirements
- Docker and Docker Compose
- Node.js (>= 18)
- npm

### Environment Variables
Create a `.env` file in the root directory:

```bash
      - MONGODB_URI=mongodb://mongodb:27017/movieapp?directConnection=true
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - PRIVATE_KEY=secretKey002
      - PORT=80
```

### 🤔 Challenges Faced

During the development of this project, several challenges were encountered:

1. **Session Management**: Implementing efficient session handling with Redis required careful consideration of data structure and caching strategies.

2. **Concurrent Ticket Booking**: Ensuring atomic operations for ticket bookings to prevent double-booking of seats was challenging.

3. **Testing**: Writing comprehensive tests for asynchronous operations and mocking dependencies required detailed test scenarios.

4. **Docker Configuration**: Setting up the multi-container environment with proper networking between MongoDB, Redis and the API service needed careful configuration.
5. **Bcrypt Installation**: During Docker build, bcrypt installation failed due to Python and build tools dependencies. This was resolved by:
   - First uninstalling bcrypt
   - Installing required build dependencies (python3, make, g++, node-gyp)
   - Reinstalling bcrypt with --build-from-source flag


6. **Performance Optimization**: Implementing caching strategies for frequently accessed data while maintaining data consistency.

7. **Error Handling**: Creating a robust error handling system that provides meaningful feedback to API consumers.

### 📦 Project Structure

The project is organized into the following key directories and files:











