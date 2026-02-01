FROM node:18-slim

# Install LaTeX and required packages
RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-latex-extra \
    texlive-fonts-extra \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files from the backend subdirectory
COPY backend/package*.json ./

RUN npm install

# Copy the rest of the backend files
COPY backend/ .

EXPOSE 10000

# Ensure the server starts correctly
CMD ["node", "server.js"]
