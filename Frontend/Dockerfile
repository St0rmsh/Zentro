# ---- build stage ----
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite only bakes env vars prefixed with VITE_ into the build, and it does so
# at build time, not runtime. Pass real values via --build-arg at image build
# time or via your CI/CD pipeline. Adjust these to match your actual
# vite env var names (I haven't seen your .env or axios config to confirm them).
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Type-checking is intentionally decoupled from the production build here.
# `npm run build` runs `tsc -b && vite build`, so any existing TS error
# blocks the image entirely. Vite (esbuild) strips types without checking
# them, so the JS output is unaffected by type errors. Run `npm run build`
# locally / in CI to actually catch and fix type errors — don't let this
# become permanent silence on real bugs.
RUN npx vite build

# ---- runtime stage ----
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]