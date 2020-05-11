# Build an Angular + NGINX container

1. Create a new NGINX config file under `angular-demo/nginx-conf`, called `nginx.conf`
We will say we want a server listening on port 80 and with the name localhost. 
```
server {
    listen       80;
    server_name  localhost;
}
```

We can add inside the `server` block the location of the Angular app from which it will be served. 
```
location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }
```

We set up the nginx server to work as a reverse-proxy to our backend service
```
location /user-app {
        set $users_service_host http://users-service:3000;
        proxy_pass $users_service_host;
    }
```
Every request made to the nginx server at `/user-app/*` will be sent to `http://users-service:3000/user-app/*`. For example: `/user-app/user  -----> http://users-service:3000/user-app/users`   
There is one more thing we need to add, a DNS resolver for the backend-services, in this case we will use Docker DNS resolver
```
resolver 127.0.0.11 valid=30s;
```
Next, we set up our error page:
```
error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
```

The final result should look like this:
```
server {
    listen       80;
    server_name  localhost;
    resolver 127.0.0.11 valid=30s;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    location /user-app {
        set $users_service_host http://users-service:3000;
        proxy_pass $users_service_host;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}

```



2. Create a Dockerfile under `angular-demo` folder  
2.1.1 Start with `FROM node:alpine AS builder`. We will use a node image, as an intermediate image, in which we will first build the application  
2.1.2 Set the working directory `WORKDIR /app`  
2.1.3 Copy the package.json and package.lock.json inside the image: `COPY package*.json ./`  
2.1.4 Install the dependencies `npm install`. `RUN npm install`  
We do not copy the source code of our application yet because we want Docker to cache everything until this layer and only rerun this part if we modify the package.json  
2.1.5 Next we copy the source code `COPY . ./`  
2.1.6 The last step for this intermediate image is to build the application `RUN $(npm bin)/ng build`  
2.2.1 The next image we will use is nginx `FROM nginx`  
2.2.2 We copy the build result from the builder image. `COPY --from=builder /app/dist/demo/ /usr/share/nginx/html` 
2.2.3 We copy the nginx-conf into the container as well `COPY nginx-conf/nginx.conf /etc/nginx/conf.d/default.conf`  

In the end it should look something like this:
```
FROM node:alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN $(npm bin)/ng build

FROM nginx
COPY --from=builder /app/dist/demo/ /usr/share/nginx/html
COPY nginx-conf/nginx.conf /etc/nginx/conf.d/default.conf

```


3. Next we have to create our docker-compose.yaml, in the root of the project. 
```
version: '3.3'

services:
  users-ui:
    build: 
      context: angular-demo
    ports:
    - 4200:80
    depends_on: 
      - users-service
  users-service:
    build: 
      context: server-demo
    ports:
    - 3000:3000

```

4. We will also add a `.dockerignore` file under `angular-demo`. We can add here any files that we don't want to use in the build process, like `node_modules` for example. This will speed up our build process.  
5. Run `docker-compese up --build` in the root folder. 
6. You should be able to access the application from `localhost:4200` and see a list of 5 users in a table. 
![](https://i.ibb.co/wc5jK4x/angular-nginx.png)


