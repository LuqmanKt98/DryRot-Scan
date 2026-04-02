# Use the official lightweight Node.js 20 image.
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy application manifests
COPY package*.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm install

# Copy the source code
COPY . .

# Run the build script to generate the 'dist' directory
RUN npm run build

# Set the environment variables for production
ENV NODE_ENV=production

# The port Cloud Run typically injects
ENV PORT=8080
EXPOSE 8080

# Start the Node.js production server
CMD ["npm", "start"]

