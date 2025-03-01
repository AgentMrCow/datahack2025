# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy project files
COPY . /app

# Install dependencies
RUN npm install

# Build the Next.js project
RUN npm run build

# Expose Next.js on port 3000
EXPOSE 3000

# Start Next.js
CMD ["npm", "start"]
