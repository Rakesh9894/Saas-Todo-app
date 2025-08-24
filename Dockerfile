# Use Node.js official image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first 
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files into the container
COPY . .

# Expose app port
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]

