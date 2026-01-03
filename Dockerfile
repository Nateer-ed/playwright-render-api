FROM mcr.microsoft.com/playwright:v1.42.0-jammy

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 10000

# Start the application
CMD ["npm", "start"]
```

### 2. Create a `.dockerignore` file:
```
node_modules
npm-debug.log
.git
.gitignore