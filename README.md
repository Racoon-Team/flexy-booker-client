# flexy-booker-client
Web app for flexy booker client
## Install
npm install
## Septup env
copy .env.example .env
## Run Backend
npm run dev
## Steps to set up Docker for Mac
1. To start it, run this command: `docker compose up -d` inside the server project and the container will automatically appear in Docker.
2. To verify that everything is okay, run this command: `docker ps`
3. Next, we check the postgres_db logs, and it should say at the bottom "database system is ready to accept connections." If it doesn't say that, the ports may be in use.
4. The same applies to flyway; it should say below “Successfully validated 5 migrations (execution time 00:00.012s).Current version of schema "public": 5”
5. If you get an error, check the ports with this command: `lsof -i :5432`. We need to use "5432". In this case, "postgres" shouldn't appear; only com.docker should be listed.
6. If Postgres is occupying the port, you have to remove it with the command `kill -9 701`; 701 is the PID.
7. After removing it, they restart it and bring Docker back up. 
8. And it has to appear only as com.Docker
9. Then they configure it in DBeaver, entering the repository name and password found in the docker-compose.yml file. 
## Steps to set up Docker for Windows
1. To start it, run this command: `docker compose up -d` inside the server project and the container will automatically appear in Docker.
2. To verify that everything is okay, run this command: `docker ps`
3. Next, we check the postgres_db logs, and it should say at the bottom "database system is ready to accept connections." If it doesn't say that, the ports may be in use.
4. The same applies to flyway; it should say below “Successfully validated 5 migrations (execution time 00:00.012s).Current version of schema "public": 5”
5. If you get an error, check the ports with this command: `netstat -ano | findstr :5432`. We need to use "5432". In this case, Only one process should appear using port 5432.
6. If Postgres is occupying the port, you have to remove it with the command `taskkill /PID 701 /F`; 701 is the PID.
7. After removing it, they restart it and bring Docker back up. 
8. Only one process should appear using port 5432.
9. Then they configure it in DBeaver, entering the repository name and password found in the docker-compose.yml file. 

## Note 
If that doesn't work, check background processes by pressing `Windows+R`, going to Services, and disabling or stopping PostgreSQL.