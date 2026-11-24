# Google Cloud Run image (Nov 2026: Vercel Hobby paused the app for Fluid
# CPU limits). Next.js "standalone" output: a small server.js plus only the
# node_modules it actually needs.
FROM node:24-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:24-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* values are baked into the browser bundle at build time;
# they come from .env.production (written by scripts/cloudrun/deploy.sh,
# never committed). VERCEL_ENV=production keeps the production-only
# behaviour in next.config.ts and the app (no content TODO markers,
# production URL guard) identical to the Vercel build.
ENV NEXT_TELEMETRY_DISABLED=1 VERCEL_ENV=production STANDALONE=1
# .env.production is build-time only: removed right after, and the final
# stage below copies only build output, never this file.
# Google Fonts sometimes answers Cloud Build with font URLs that next/font
# cannot read ("Cannot read properties of null (reading '1')" in next/font),
# though the same build passes moments later — so try the build up to 3 times.
RUN for i in 1 2 3; do npm run build && break; if [ "$i" = 3 ]; then exit 1; fi; echo "Build failed (attempt $i), retrying in 20 s"; sleep 20; done \
 && rm -f .env.production .next/standalone/.env*

FROM node:24-slim AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 VERCEL_ENV=production PORT=8080 HOSTNAME=0.0.0.0
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 8080
CMD ["node", "server.js"]
