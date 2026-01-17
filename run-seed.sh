#!/bin/bash

# Load environment variables
source .env

# Run the seed SQL file
psql "$DATABASE_URL" -f seed.sql

echo "✅ Database seeded successfully!"
