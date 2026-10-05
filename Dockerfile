
# #  THis creates a docker image

# # the node version
# FROM node:24.11.1-alpine  

# # this creates a sets the working dictory inside the container
# WORKDIR /app  

# # copy all the dependencies to the folder
# COPY package*.json ./

# # this install dependencies to image 
# # RUN npm ci

# # this doesnt install the development dependiency 
# RUN npm install --omit=dev

# # coppy the rest of the file into the app
# COPY . .

# # this container exposed to this port 
# EXPOSE 8080

# # this tell the docker when to start the container
# CMD ["npm", "start"]

# 1. Use a specific, locked version of the alpine image
FROM node:24.11.1-alpine

# 2. Set up a secure working directory
WORKDIR /usr/src/node-app
RUN chown -R node:node /usr/src/node-app

# 3. Copy package files first to leverage Docker layer caching
COPY package*.json ./

# 4. Switch to the non-root user BEFORE installing dependencies
USER node

# 5. Use clean install restricted to production dependencies
RUN npm ci --omit=dev

# 6. Copy the rest of the application files with correct ownership
COPY --chown=node:node . .

# 7. Expose the port and run the app directly via Node
EXPOSE  8080
CMD ["node", "src/index.js"]
