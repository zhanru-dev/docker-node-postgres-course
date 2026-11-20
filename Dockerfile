FROM node:26-bookworm-slim@sha256:5df79989ed685e09f0a98019db4cebfb22fb9df1a53c0161664a011f7ff6b0f1  AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci

FROM node:26-bookworm-slim@sha256:5df79989ed685e09f0a98019db4cebfb22fb9df1a53c0161664a011f7ff6b0f1 AS runtime

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY package.json server.js ./

COPY public ./public

RUN chmod 644 /app/package.json /app/server.js && chmod -R u=rwX,go=rX /app/public

USER node

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 CMD node -e "fetch('http://127.0.0.1:80/health').then(r => process.exit(r.status === 200 ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]
