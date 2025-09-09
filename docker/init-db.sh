#!/bin/bash
set -e

# Create additional databases for different environments if needed
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create test database
    CREATE DATABASE beyond_home_test;
    
    -- Grant privileges  
    GRANT ALL PRIVILEGES ON DATABASE beyond_home_development TO postgres;
    GRANT ALL PRIVILEGES ON DATABASE beyond_home_test TO postgres;
    
    -- Log successful setup
    \echo 'PostgreSQL databases initialized successfully!'
EOSQL