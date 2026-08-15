# Push Docker Images to AWS ECR Private Repository

## 1. Prerequisites

Docker images were already built locally:

```powershell
docker images
```

Expected application images:

```text
docker-prac-backend:latest
docker-prac-frontend:latest
```

AWS CLI was installed and verified:

```powershell
aws --version
```

---

## 2. Configure AWS CLI

Configure the AWS CLI:

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

Verify the AWS identity:

```powershell
aws sts get-caller-identity
```

---

## 3. Create Private ECR Repositories

In AWS Console:

**Amazon ECR → Private repositories → Create repository**

Created:

```text
docker-prac-backend
docker-prac-frontend
```

Region:

```text
us-east-1
```

---

## 4. Verify ECR Repositories

```powershell
aws ecr describe-repositories --region us-east-1 --query "repositories[].repositoryName" --output table
```

Expected:

```text
docker-prac-backend
docker-prac-frontend
```

---

## 5. Login Docker to AWS ECR

Use the AWS account ID and region:

```powershell
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 489391486182.dkr.ecr.us-east-1.amazonaws.com
```

Expected:

```text
Login Succeeded
```

---

## 6. Tag the Backend Image

```powershell
docker tag docker-prac-backend:latest 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-backend:latest
```

## 7. Tag the Frontend Image

```powershell
docker tag docker-prac-frontend:latest 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-frontend:latest
```

---

## 8. Push Backend Image to ECR

```powershell
docker push 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-backend:latest
```

## 9. Push Frontend Image to ECR

```powershell
docker push 489391486182.dkr.ecr.us-east-1.amazonaws.com/docker-prac-frontend:latest
```

---

## 10. Verify Images in ECR

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

---

## Final Result

Both Docker images are now stored in private AWS ECR repositories:

```text
AWS ECR
│
├── docker-prac-backend
│   └── latest ✅
│
└── docker-prac-frontend
    └── latest ✅
```

### Overall Flow

```text
Local Docker Images
        │
        ▼
AWS CLI Authentication
        │
        ▼
Docker Login to ECR
        │
        ▼
Tag Docker Images
        │
        ▼
docker push
        │
        ▼
AWS ECR Private Repositories
```

> **Security:** Never commit or share your AWS Access Key or Secret Access Key. Do not put them in your Git repository or Docker images.
