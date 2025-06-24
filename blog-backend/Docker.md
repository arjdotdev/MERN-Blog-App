a. locally via Docker: docker installs mongoDB for you inside an isloated environment. It spins up a new container from that image (which are minimal Linux userland and mongodb binary). Inside the container, it runs mongodb. You do not install MongoDB on your OS but the container has everything it needs.

Run MongoDB using Docker

docker pull mongo:6 //downloads mongoDB 6.0 image for Docker Hub

docker run -d `
--name blog-mongo`
-p 27017:27017 `
-v blog-mongo-data:/data/db`
mongo:6

-d => detached mode (runs in background)
--name blog-mongo => container name
-p 27017:27017 => expose container's port 27-17 on localhost
-v blog-mongo-data:/data/db => store data in Docker volume name blog-mongo-data

docker ps //lists all running containers

docker stop blog-mongo //to stop
docker rm blog-mongo //remove image

MONGO_URI=mongodb://localhost:27017/blog
localhost:27017 → Docker maps this to your Mongo container.
/blog → the database name (auto-created on first write).

Successfully Connected
