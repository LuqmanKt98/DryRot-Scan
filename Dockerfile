# Use the official lightweight Node.js 20 image.
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
COPY package*.json ./

# Install dependencies (includes devDependencies required for the build phase)
RUN npm ci

# Copy the local code to the container's workspace.
COPY . .

# Build the Vite application (frontend)
RUN npm run build

# Set the environment variables for production
ENV NODE_ENV=production

# The port Cloud Run typically injects, ensuring our app accesses it
ENV PORT=8080
EXPOSE 8080

# Start the Node.js production server
CMD ["npm", "start"]
