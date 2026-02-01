FROM node:18-slim

# Install LaTeX (MINIMAL) and required packages
# Removed texlive-fonts-extra to stay under size limits
RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-latex-extra \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files from the backend folder
COPY backend/package*.json ./

RUN npm install

# Copy everything from the backend folder
COPY backend/ .

EXPOSE 10000

# Start the server using the script
CMD ["npm", "start"]
