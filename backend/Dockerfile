FROM node:18-slim

# Install LaTeX and required packages
RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-latex-extra \
    texlive-fonts-extra \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files (already in this directory since Root Directory will be 'backend')
COPY package*.json ./

RUN npm install

# Copy application code
COPY . .

EXPOSE 10000

# Start the server
CMD ["node", "server.js"]
