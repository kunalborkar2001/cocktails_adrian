# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the project
COPY . .

# Expose the Vite dev server port
EXPOSE 5173

# Start the dev server
CMD ["npm", "run", "dev"]
