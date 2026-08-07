# 🐳 Docker Commands Cheat Sheet

A quick reference for the Docker commands used while learning Docker with a Node.js + MongoDB application.

---

# 1. Check Docker Version

```bash
docker --version
docker compose version
```

---

# 2. Download an Image

```bash
docker pull mongo
docker pull mongo-express
```

---

# 3. View Images

```bash
docker images
```

---

# 4. Create a Docker Network

```bash
docker network create mongo-network
```

View networks:

```bash
docker network ls
```

Inspect a network:

```bash
docker network inspect mongo-network
```

---

# 5. Run MongoDB Container

```bash
docker run -d \
--name mongodb \
--network mongo-network \
-p 27017:27017 \
-e MONGO_INITDB_ROOT_USERNAME=admin \
-e MONGO_INITDB_ROOT_PASSWORD=password \
mongo
```

### Windows PowerShell (One Line)

```powershell
docker run -d --name mongodb --network mongo-network -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo
```

---

# 6. Run Mongo Express

```bash
docker run -d \
--name mongo-express \
--network mongo-network \
-p 8081:8081 \
-e ME_CONFIG_MONGODB_URL="mongodb://admin:password@mongodb:27017/?authSource=admin" \
-e ME_CONFIG_BASICAUTH_USERNAME=admin \
-e ME_CONFIG_BASICAUTH_PASSWORD=password \
mongo-express
```

### Windows PowerShell (One Line)

```powershell
docker run -d --name mongo-express --network mongo-network -p 8081:8081 -e ME_CONFIG_MONGODB_URL="mongodb://admin:password@mongodb:27017/?authSource=admin" -e ME_CONFIG_BASICAUTH_USERNAME=admin -e ME_CONFIG_BASICAUTH_PASSWORD=password mongo-express
```

---

# 7. View Running Containers

```bash
docker ps
```

---

# 8. View All Containers

```bash
docker ps -a
```

---

# 9. Start Existing Containers

```bash
docker start mongodb
docker start mongo-express
```

---

# 10. Stop Containers

```bash
docker stop mongodb
docker stop mongo-express
```

Stop all running containers:

```bash
docker stop $(docker ps -q)
```

---

# 11. Restart Containers

```bash
docker restart mongodb
docker restart mongo-express
```

---

# 12. Remove Containers

```bash
docker rm mongodb
docker rm mongo-express
```

Force remove:

```bash
docker rm -f mongodb
```

---

# 13. View Container Logs

```bash
docker logs mongodb
docker logs mongo-express
```

Follow logs live:

```bash
docker logs -f mongodb
```

---

# 14. Inspect a Container

```bash
docker inspect mongodb
```

Inspect environment variables:

```bash
docker inspect mongo-express --format "{{range .Config.Env}}{{println .}}{{end}}"
```

---

# 15. Execute Commands Inside a Container

Open MongoDB container shell:

```bash
docker exec -it mongodb bash
```

If bash isn't available:

```bash
docker exec -it mongodb sh
```

---

# 16. Remove Docker Network

```bash
docker network rm mongo-network
```

---

# 17. Remove an Image

```bash
docker rmi mongo
docker rmi mongo-express
```

---

# 18. Remove Everything (Cleanup)

Remove stopped containers:

```bash
docker container prune
```

Remove unused images:

```bash
docker image prune
```

Remove unused networks:

```bash
docker network prune
```

Remove everything unused:

```bash
docker system prune
```

Remove everything including images:

```bash
docker system prune -a
```

---

# 19. Common URLs

MongoDB

```
localhost:27017
```

Mongo Express

```
http://localhost:8081
```

Node Backend

```
http://localhost:5000
```

Frontend

```
http://localhost:3000
```

---

# 20. MongoDB Connection String

```text
mongodb://admin:password@localhost:27017/user-account?authSource=admin
```

---

# 21. Useful Docker Workflow

Start Docker Desktop

```bash
docker ps
```

Start containers

```bash
docker start mongodb
docker start mongo-express
```

Run backend

```bash
cd backend
node server.js
```

Run frontend

```bash
cd frontend
python -m http.server 3000
```

Open

```
http://localhost:3000
http://localhost:5000
http://localhost:8081
```

---

# 22. Commands You Learned

- docker pull
- docker run
- docker ps
- docker ps -a
- docker stop
- docker start
- docker restart
- docker rm
- docker logs
- docker exec
- docker inspect
- docker images
- docker network create
- docker network ls
- docker network inspect
- docker network rm
- docker image prune
- docker system prune

---