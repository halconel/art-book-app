#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails
rm -f /app/tmp/pids/server.pid

echo "🚀 Starting Art Book App container..."

# Function to wait for PostgreSQL
wait_for_postgres() {
  echo "⏳ Waiting for PostgreSQL to be ready..."
  
  until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USERNAME"; do
    echo "PostgreSQL is unavailable - sleeping"
    sleep 2
  done
  
  echo "✅ PostgreSQL is ready!"
}

# Function to setup database
setup_database() {
  echo "🗄️ Setting up database..."
  
  # Check if database exists
  if bundle exec rails runner "ActiveRecord::Base.connection" 2>/dev/null; then
    echo "✅ Database connection successful"
    
    # Run pending migrations
    echo "🔄 Running database migrations..."
    bundle exec rails db:migrate
    
    # Seed database if in development and SEED_DB is set
    if [[ "$RAILS_ENV" == "development" && "$SEED_DB" == "true" ]]; then
      echo "🌱 Seeding database..."
      bundle exec rails db:seed
    fi
  else
    echo "📦 Creating and setting up database..."
    bundle exec rails db:create
    bundle exec rails db:migrate
    
    if [[ "$RAILS_ENV" == "development" && "$SEED_DB" == "true" ]]; then
      echo "🌱 Seeding database..."
      bundle exec rails db:seed
    fi
  fi
}

# Function to precompile assets (production only)
precompile_assets() {
  if [[ "$RAILS_ENV" == "production" ]]; then
    echo "🎨 Precompiling assets..."
    bundle exec rails assets:precompile
  fi
}

# Main execution flow
main() {
  # Wait for PostgreSQL if database host is set
  if [[ -n "$POSTGRES_HOST" ]]; then
    wait_for_postgres
  fi
  
  # Setup database
  setup_database
  
  # Precompile assets in production
  precompile_assets
  
  echo "✅ Initialization complete!"
  
  # Execute the main command
  exec "$@"
}

# Health check endpoint function
if [[ "$1" == "health" ]]; then
  # Simple health check - try to connect to database
  if bundle exec rails runner "ActiveRecord::Base.connection" 2>/dev/null; then
    echo "healthy"
    exit 0
  else
    echo "unhealthy"
    exit 1
  fi
fi

# Run main function
main "$@"