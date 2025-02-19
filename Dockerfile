### STAGE 1: Build Angular app
#-----------------------------------
# Install Node.js
FROM node:23.8 AS builder

# Set working dir
WORKDIR /compileDir

RUN npm i -g @angular/cli

# Copy src files & folders into container [COPY src(cli root) dest(workdir)]
COPY angular.json .
COPY package.json .
COPY package-lock.json .
COPY tsconfig.app.json .
COPY tsconfig.spec.json .
COPY tsconfig.json .
COPY public public
COPY src src

# Install packages from package.json (outputs => node_module)
RUN npm ci

# Build the Angular app (=> dist/<proj name>/browser)
RUN ng build

### STAGE 2: Create final image
#------------------------------------
FROM caddy:2-alpine

LABEL maintainer="hazim"

# Set working dir
WORKDIR /webapp

# Copy over Angular build output from 1st container (builder) into 2nd container
COPY --from=builder /compileDir/dist/day32_workshop/browser /webapp/browser

# Copy the Caddyfile to working dir
COPY Caddyfile .

# Set environment variables
ENV SERVER_PORT=8080

# Expose app's port 
EXPOSE ${SERVER_PORT}

# Run app
ENTRYPOINT caddy run --config ./Caddyfile