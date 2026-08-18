# Docker Practice Repository

A hands-on Docker learning project where I containerized a full-stack
application, added MongoDB and Mongo Express, used Docker Compose and
persistent volumes, and pushed application images to private AWS ECR
repositories for backend and frontend.

## Project Structure

``` text
docker-prac/
├── backend/
│   ├── models/
│   │   └── User.js
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   └── script.js
├── mongo-docker-compose.yaml
├── DOCKER_COMMANDS.md
├── aws-ecr-docker-push.md
├── .gitignore
└── README.md
```

## Architecture

``` text
                    Docker Compose
                         |
       +-----------------+------------------+
       |                 |                  |
       v                 v                  v
   Frontend           Backend           MongoDB
   Nginx:80          Node/Express       27017
   :3000             :5000                  |
       |                 |                  |
       |                 +------------------+
       |                            |
       |                      mongo-data volume
       |
       +---- Mongo Express :8081 ----> MongoDB
```

  Service         Technology          Host Port   Container Port
  --------------- ----------------- ----------- ----------------
  frontend        Nginx                    3000               80
  backend         Node.js/Express          5000             5000
  mongodb         MongoDB                 27017            27017
  mongo-express   Mongo Express            8081             8081

All services communicate through the `mongo-network` Docker network.

## Dockerization

The backend has its own Dockerfile and is packaged as a Docker image.

The frontend has its own Dockerfile and is served by Nginx.

Local images:

``` text
docker-prac-backend:latest
docker-prac-frontend:latest
```

Build the application:

``` bash
docker compose -f mongo-docker-compose.yaml up -d --build
```

After changing backend/frontend code, rebuild the affected images before
recreating containers.

## MongoDB

MongoDB runs with:

``` text
Username: admin
Password: password
Port: 27017
```

Mongo Express is available at:

``` text
http://localhost:8081
```

The backend connects to MongoDB through the Compose service name:

``` text
mongodb
```

not `localhost`.

Example:

``` text
mongodb://admin:password@mongodb:27017/user-account?authSource=admin
```

This demonstrates Docker's internal service discovery and networking.

## Docker Network

Compose creates:

``` yaml
networks:
  mongo-network:
    driver: bridge
```

Containers on this network can communicate using service names:

``` text
backend -> mongodb:27017
mongo-express -> mongodb:27017
```

## Docker Volumes

MongoDB uses a named volume:

``` yaml
volumes:
  - mongo-data:/data/db
```

and:

``` yaml
volumes:
  mongo-data:
```

This makes database data persistent across normal container recreation.

Check volumes:

``` bash
docker volume ls
```

Inspect the volume:

``` bash
docker volume inspect docker-prac_mongo-data
```

Important difference:

``` bash
docker compose -f mongo-docker-compose.yaml down
```

removes containers/network but keeps the named volume.

``` bash
docker compose -f mongo-docker-compose.yaml down -v
```

also removes the volume and therefore deletes the persisted MongoDB
data.

## Docker Compose

Start the complete stack:

``` bash
docker compose -f mongo-docker-compose.yaml up -d
```

Build and start:

``` bash
docker compose -f mongo-docker-compose.yaml up -d --build
```

Check containers:

``` bash
docker ps
```

Stop/remove the stack:

``` bash
docker compose -f mongo-docker-compose.yaml down
```

Open:

``` text
Frontend:      http://localhost:3000
Backend:       http://localhost:5000
Mongo Express: http://localhost:8081
```

## Current Compose Services

The Compose file contains:

``` yaml
services:
  mongodb:
    image: mongo
    container_name: mongodb
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    networks:
      - mongo-network
    volumes:
      - mongo-data:/data/db

  mongo-express:
    image: mongo-express
    container_name: mongo-express
    restart: always
    ports:
      - "8081:8081"
    environment:
      ME_CONFIG_MONGODB_URL: mongodb://admin:password@mongodb:27017/?authSource=admin
      ME_CONFIG_BASICAUTH_USERNAME: admin
      ME_CONFIG_BASICAUTH_PASSWORD: password
    depends_on:
      - mongodb
    networks:
      - mongo-network

  backend:
    image: 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-backend:latest
    container_name: backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      MONGO_URI: mongodb://admin:password@mongodb:27017/user-account?authSource=admin
    depends_on:
      - mongodb
    networks:
      - mongo-network

  frontend:
    image: 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-frontend:latest
    container_name: frontend
    restart: always
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - mongo-network

networks:
  mongo-network:
    driver: bridge

volumes:
  mongo-data:
```

## Useful Docker Commands

``` bash
docker ps
docker ps -a
docker images
docker network ls
docker volume ls
docker volume inspect docker-prac_mongo-data
```

Logs:

``` bash
docker logs mongodb
docker logs mongo-express
docker logs backend
docker logs frontend
docker logs -f backend
```

Container lifecycle:

``` bash
docker start mongodb
docker stop mongodb
docker rm mongodb
```

## AWS ECR Private Registry

I created two private Amazon ECR repositories:

``` text
docker-prac-backend
docker-prac-frontend
```

Registry:

``` text
489391486182.dkr.ecr.us-east-1.amazonaws.com
```

Repository URIs:

``` text
489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-backend
489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-frontend
```

ECR is the private container image registry. It stores the Docker
images; it does not itself run the application.

## AWS CLI

Check AWS CLI:

``` bash
aws --version
```

Configure credentials:

``` bash
aws configure
```

Verify the current AWS identity:

``` bash
aws sts get-caller-identity
```

Never commit AWS access keys or secret keys to Git.

## Login to ECR

``` bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 489391486182.dkr.ecr.us-east-1.amazonaws.com
```

Expected result:

``` text
Login Succeeded
```

## Tag Images for ECR

Backend:

``` bash
docker tag docker-prac-backend:latest 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-backend:latest
```

Frontend:

``` bash
docker tag docker-prac-frontend:latest 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-frontend:latest
```

## Push Images to ECR

``` bash
docker push 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-backend:latest
```

``` bash
docker push 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-frontend:latest
```

Verify repositories:

``` bash
aws ecr describe-repositories --region us-east-1 --query "repositories[].repositoryName" --output table
```

Verify image tags:

``` bash
aws ecr describe-images --repository-name docker-prac-backend --region us-east-1 --query "imageDetails[].imageTags"
```

``` bash
aws ecr describe-images --repository-name docker-prac-frontend --region us-east-1 --query "imageDetails[].imageTags"
```

## Pulling Private Images

An authorized developer or server can authenticate and pull the images:

``` bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 489391486182.dkr.ecr.us-east-1.amazonaws.com
```

``` bash
docker pull 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-backend:latest
docker pull 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-frontend:latest
```

This is how the private registry can distribute the images to authorized
environments.

## Updating the Application

Docker images are snapshots. Changing source code does not automatically
change an existing image.

Workflow:

``` text
Change code
   ↓
Rebuild image
   ↓
Tag image
   ↓
Push to ECR
   ↓
Pull updated image
   ↓
Recreate containers
```

For local builds:

``` bash
docker compose -f mongo-docker-compose.yaml up -d --build
```

Then tag and push the updated images:

``` bash
docker tag docker-prac-backend:latest 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-backend:latest
docker tag docker-prac-frontend:latest 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-frontend:latest

docker push 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-backend:latest
docker push 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-frontend:latest
```

On another authorized machine:

``` bash
docker pull 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-backend:latest
docker pull 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-frontend:latest
```

## Troubleshooting Lessons

### Docker daemon error

If Docker reports that it cannot connect to the Docker API, make sure
Docker Desktop is running:

``` bash
docker ps
```

### Container name conflict

If:

``` text
Conflict. The container name "/mongodb" is already in use
```

check:

``` bash
docker ps -a
```

Start the existing container:

``` bash
docker start mongodb
```

or remove it if it is no longer required:

``` bash
docker rm mongodb
```

### Port already in use

If port `5000` is occupied, check:

``` bash
docker ps
```

and stop the conflicting container, or map another host port:

``` yaml
ports:
  - "5001:5000"
```

### PowerShell multiline commands

On Windows PowerShell, line continuation uses a backtick:

``` text
`
```

Using Linux-style `\` can cause PowerShell parser errors.

## Important Docker Concepts Learned

### Image

A packaged blueprint from which containers are created.

### Container

A running instance of an image.

### Dockerfile

Instructions used to build an image.

### Network

Allows containers to communicate with each other.

### Volume

Persistent storage that survives normal container recreation.

### Compose

Defines and orchestrates multiple services as one application.

### Registry

Stores and distributes container images.

In this project:

``` text
AWS ECR = private Docker registry
```

## Complete Learning Journey

``` text
Node.js + Frontend application
            ↓
       Dockerfiles
            ↓
      Docker images
            ↓
   Backend + Frontend
            ↓
        MongoDB
            ↓
     Mongo Express
            ↓
     Docker network
            ↓
     Docker Compose
            ↓
      Named volume
            ↓
   Persistent database
            ↓
       AWS CLI
            ↓
      Private ECR
            ↓
   Tag Docker images
            ↓
      Push images
            ↓
      Pull images
            ↓
     Ready for deployment
```

## What Is Completed

-   [x] Docker fundamentals
-   [x] Backend containerization
-   [x] Frontend containerization
-   [x] MongoDB container
-   [x] Mongo Express
-   [x] Docker networking
-   [x] Docker Compose
-   [x] Environment variables
-   [x] Named Docker volumes
-   [x] Persistent MongoDB data
-   [x] Multi-container application
-   [x] AWS CLI setup
-   [x] Private AWS ECR repositories
-   [x] Docker authentication with ECR
-   [x] Image tagging
-   [x] Backend image pushed to ECR
-   [x] Frontend image pushed to ECR
-   [x] ECR image verification
-   [x] Pulling private ECR images

## Next Step: Deployment

ECR stores the images but does not run them.

The next stage is to deploy the containerized application using one of
these approaches:

``` text
Option 1:
AWS ECR → EC2 → Docker → Docker Compose

Option 2:
AWS ECR → ECS/Fargate → Running containers

Option 3:
GitHub → CI/CD → Build → ECR → Deployment
```

A good next learning project is deploying the ECR images to an AWS EC2
instance and running the application there with Docker Compose.

## Security Notes

The credentials in this learning project are examples only.

For production:

-   Never commit AWS credentials.
-   Never commit `.env` files containing secrets.
-   Use least-privilege IAM policies.
-   Use AWS Secrets Manager or another secure secret store.
-   Avoid hard-coded database passwords.
-   Prefer versioned/immutable image tags for production instead of
    relying only on `latest`.
-   Do not expose MongoDB publicly unless there is a specific and secure
    reason to do so.

## Goal of This Repository

This repository documents the progression from a local application to a
containerized, multi-service application with persistent storage and a
private cloud container registry:

``` text
Local Application
       ↓
Docker
       ↓
Docker Compose
       ↓
Persistent Storage
       ↓
Private AWS ECR
       ↓
Cloud Deployment
```

The Dockerization, Compose, volume, networking, and private ECR stages
are completed. The next major stage is deploying these ECR images to
actual compute infrastructure.
