# Docker → AWS ECR Private Repository Workflow

## 1. Build the application images

From the project root:

```powershell
docker compose -f mongo-docker-compose.yaml up -d --build
```

Check images:

```powershell
docker images
```

Expected application images:

```text
docker-prac-backend:latest
docker-prac-frontend:latest
```

## 2. Run the complete application

```powershell
docker compose -f mongo-docker-compose.yaml up -d
```

Check containers:

```powershell
docker ps
```

Our stack contains:

```text
frontend
backend
mongodb
mongo-express
```

Mongo Express:

```text
http://localhost:8081
```

## 3. Create private ECR repositories

In AWS:

```text
AWS Console
→ Amazon ECR
→ Private repositories
→ Create repository
```

Created:

```text
docker-prac-backend
docker-prac-frontend
```

Region:

```text
us-east-1
```

## 4. Configure AWS CLI

```powershell
aws configure
```

Enter:

```text
AWS Access Key ID: <your access key>
AWS Secret Access Key: <your secret key>
Default region name: us-east-1
Default output format: json
```

Verify:

```powershell
aws sts get-caller-identity
```

Never share your AWS Secret Access Key.

## 5. Verify ECR repositories

```powershell
aws ecr describe-repositories --region us-east-1 --query "repositories[].repositoryName" --output table
```

## 6. Login Docker to ECR

```powershell
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 489391486182.dkr.ecr.us-east-1.amazonaws.com
```

Expected:

```text
Login Succeeded
```

## 7. Tag the images

Backend:

```powershell
docker tag docker-prac-backend:latest 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-backend:latest
```

Frontend:

```powershell
docker tag docker-prac-frontend:latest 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-frontend:latest
```

## 8. Push images to ECR

Backend:

```powershell
docker push 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-backend:latest
```

Frontend:

```powershell
docker push 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-frontend:latest
```

## 9. Verify images in ECR

Backend:

```powershell
aws ecr describe-images --repository-name docker-prac-backend --region us-east-1 --query "imageDetails[].imageTags"
```

Frontend:

```powershell
aws ecr describe-images --repository-name docker-prac-frontend --region us-east-1 --query "imageDetails[].imageTags"
```

Expected:

```text
[
    [
        "latest"
    ]
]
```

# When you change your code

A Docker image does not automatically update when your source code changes.

For example, if you change:

```text
backend/server.js
```

or:

```text
frontend/script.js
```

you need to rebuild the affected image.

### 1. Change the code

Make your code changes normally.

### 2. Rebuild

Rebuild the complete application:

```powershell
docker compose -f mongo-docker-compose.yaml up -d --build
```

Or only the backend:

```powershell
docker compose -f mongo-docker-compose.yaml build backend
```

Or only the frontend:

```powershell
docker compose -f mongo-docker-compose.yaml build frontend
```

### 3. Tag the updated image

Backend:

```powershell
docker tag docker-prac-backend:latest 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-backend:latest
```

Frontend:

```powershell
docker tag docker-prac-frontend:latest 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-frontend:latest
```

### 4. Push the updated image

```powershell
docker push 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-backend:latest

docker push 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-frontend:latest
```

Only push the image that you actually changed if the other image has not changed.

# Using version tags

Instead of only using `latest`, you can use versions:

```powershell
docker tag docker-prac-backend:latest 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-backend:v1
docker push 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-backend:v1
```

After another change:

```text
v2
v3
v4
```

This makes specific releases easier to identify and roll back to.

# Local image vs ECR image

Local:

```text
docker-prac-backend:latest
```

ECR:

```text
489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-backend:latest
```

They are separate copies.

After changing code:

```text
Code Change
    ↓
Docker Build
    ↓
New Local Image
    ↓
Tag for ECR
    ↓
docker push
    ↓
Updated ECR Image
```

# Complete workflow

First time:

```text
Build
  ↓
Run/Test locally
  ↓
AWS CLI configured
  ↓
Docker login to ECR
  ↓
Tag images
  ↓
Push images
  ↓
Verify in ECR
```

After a code change:

```text
Change code
  ↓
Rebuild Docker image
  ↓
Test locally
  ↓
Tag updated image
  ↓
Push to ECR
```

# Final architecture

```text
                 LOCAL MACHINE
                      │
          ┌───────────┴───────────┐
          │                       │
     Frontend Code           Backend Code
          │                       │
          ▼                       ▼
   Frontend Image           Backend Image
          │                       │
          └───────────┬───────────┘
                      │
                      ▼
                 AWS ECR
              PRIVATE REGISTRY
                 │        │
                 ▼        ▼
            frontend   backend
             :latest    :latest
```

MongoDB and Mongo Express continue using their existing Docker images from the Compose file. We pushed only our own application images to private ECR.

## Cheat Sheet

```powershell
# Build
docker compose -f mongo-docker-compose.yaml up -d --build

# Run
docker compose -f mongo-docker-compose.yaml up -d

# Check containers
docker ps

# Check images
docker images

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 489391486182.dkr.ecr.us-east-1.amazonaws.com

# Tag backend
docker tag docker-prac-backend:latest 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-backend:latest

# Tag frontend
docker tag docker-prac-frontend:latest 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-frontend:latest

# Push backend
docker push 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-backend:latest

# Push frontend
docker push 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-frontend:latest
```
