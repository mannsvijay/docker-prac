# Docker Practice Repository

A hands-on Docker learning project where I containerized a simple full-stack application and practiced Docker networking, Docker Compose, MongoDB, persistent volumes, and AWS ECR private container registries.

The project consists of:

- Node.js + Express backend
- Static HTML/CSS/JavaScript frontend
- MongoDB database
- Mongo Express database management UI
- Docker Compose for multi-container orchestration
- Docker volumes for persistent MongoDB data
- Custom Docker networks for service-to-service communication
- AWS ECR private repositories for storing Docker images

---

## Project Architecture

```text
                    Docker Compose
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   Frontend          Backend          MongoDB
   Nginx :80        Node.js :5000     Mongo :27017
        │                │                │
        │                └───────────────►│
        │                         MongoDB Volume
        │
        ▼
   Browser :3000

                    Mongo Express
                       :8081
                         │
                         ▼
                      MongoDB