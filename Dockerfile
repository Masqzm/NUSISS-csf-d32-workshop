### STAGE 1: Build Angular app
#-----------------------------------
# Install Node.js
FROM node:23.8 AS builder

LABEL maintainer="hazim"

# Set working dir
WORKDIR /compileDir

# Copy package.json and package-lock.json to leverage Docker cache for npm install
COPY package*.json ./

# Install necessary dependencies/modules
RUN npm install

# Copy src files & folders over (COPY src dest)
COPY . .
#COPY public public
#COPY src src
#COPY node_modules node_modules
#COPY Caddyfile .

# Install the dependencies and build the Angular app
#RUN npm install
RUN npm run build

# Build ng app
#ENTRYPOINT ["ng", "build"]


### STAGE 2: Create final image
#------------------------------------
FROM caddy:latest

# Set working dir
WORKDIR /app

# Copy over browser (Angular build output) from 1st container (builder) into 2nd container
COPY --from=builder /compileDir/dist/day32_workshop/browser /webapp/browser

# Copy the Caddyfile to the final location
COPY Caddyfile /webapp

# Set environment variables
ENV SERVER_PORT=8080

# Expose app's port 
EXPOSE ${SERVER_PORT}

# Run app
ENTRYPOINT caddy run --config /webapp/Caddyfile