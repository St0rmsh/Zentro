FROM node:20-alpine

WORKDIR /app

# Install deps first for better layer caching. Note: dev deps are kept
# (not --omit=dev) because tsx and typescript run the TS source directly
# in this setup — there's no separate `tsc` build step yet. Once one
# exists, switch to a proper build stage for a leaner image.
COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
# bcrypt (and other CPU-bound native calls) run on libuv's threadpool, which
# defaults to just 4 threads per process regardless of CPU count. Under
# concurrent login load this becomes a severe bottleneck — requests queue
# behind the 4 available slots and can time out entirely. Must be set before
# Node starts; cannot be changed at runtime.
ENV UV_THREADPOOL_SIZE=128

EXPOSE 3000

# Kubernetes liveness/readiness probes hit these HTTP endpoints directly,
# but this Docker-level HEALTHCHECK also lets `docker ps` / docker-compose
# report container health during local testing.
HEALTHCHECK --interval=15s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/health/live || exit 1

CMD ["npm", "start"]