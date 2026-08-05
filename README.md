# Docker Practice Repository

This repository is used for practicing Docker with a simple full-stack app.

## Project structure

- `docker-compose.yml` - orchestrates the backend and frontend services.
- `backend/` - Node.js server application.
  - `Dockerfile` - builds the backend container.
  - `package.json` - backend dependencies and metadata.
  - `server.js` - backend app entry point.
- `frontend/` - static frontend app.
  - `Dockerfile` - builds the frontend container.
  - `index.html` - web page served by the frontend.
  - `script.js` - frontend script.

## Usage

1. Install Docker Desktop and make sure Docker is running.
2. From the repository root, build and start services:

```bash
docker-compose up --build
```

3. Open the frontend in your browser at:

```text
http://localhost:3000
```

4. Stop the services with:

```bash
docker-compose down
```

## Notes

- This repo is for Docker learning and experimentation.
- You can modify the app code, rebuild containers, and explore Docker networking.
- The backend and frontend are containerized separately to practice multi-service setups.
