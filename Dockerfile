FROM oven/bun:1 AS base
RUN apk update && apk add --no-cache libc6-compat && corepack enable

# Install dependencies and build
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile && bun build

# Runtime stage
FROM base AS runner
WORKDIR /app

# Creating user and setting permissions
RUN addgroup --system --gid 1001 bun && \
    adduser --system --uid 1001 thanhhoajs
USER thanhhoajs

COPY --from=base /app /app

EXPOSE 1234
ENV PORT=1234
CMD ["bun", "prod"]
