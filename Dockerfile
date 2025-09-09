# Multi-stage Dockerfile optimized for Docker layer caching
# Stage 1: Node.js for building frontend assets
FROM node:18-alpine AS assets

# Install dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package.json package-lock.json ./

# Install Node.js dependencies
RUN npm ci --only=production --no-audit --no-fund

# Copy frontend source files
COPY frontend/ ./frontend/
COPY webpack.config.js ./
COPY .babelrc ./

# Build frontend assets
ENV NODE_ENV=production
RUN npm run build

# Stage 2: Ruby for the Rails application
FROM ruby:3.4.4-alpine AS app

# Install system dependencies
RUN apk add --no-cache \
    postgresql-dev \
    tzdata \
    nodejs \
    git \
    build-base \
    libxml2-dev \
    libxslt-dev \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1000 -S app && \
    adduser -u 1000 -S app -G app

# Copy Gemfiles first (for better caching)
COPY Gemfile Gemfile.lock ./

# Install Ruby dependencies
RUN bundle config --global frozen 1 && \
    bundle config set --local deployment 'true' && \
    bundle config set --local without 'development test' && \
    bundle install --jobs 4 --retry 3

# Copy application code
COPY . .

# Copy built assets from assets stage
COPY --from=assets /app/app/assets/javascripts ./app/assets/javascripts

# Set correct permissions
RUN chown -R app:app /app

# Switch to non-root user
USER app

# Expose port
EXPOSE 3000

# Add entrypoint script
COPY --chown=app:app docker/entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Set entrypoint
ENTRYPOINT ["entrypoint.sh"]

# Default command
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]