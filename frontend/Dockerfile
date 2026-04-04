FROM node:20-alpine

WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

EXPOSE 3000

# Start Next.js dev server — listens on all interfaces inside container
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]
