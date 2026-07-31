# Optional — local/prod container for the API + static UI
FROM node:20-alpine
WORKDIR /app
COPY backend/package.json ./backend/package.json
RUN cd backend && npm install --omit=dev
COPY backend ./backend
COPY index.html admin.html manifest.json sw.js ./
COPY css ./css
COPY js ./js
COPY images ./images
COPY fotot ./fotot
WORKDIR /app/backend
EXPOSE 5000
CMD ["node", "src/server.js"]
