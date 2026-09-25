#!/bin/sh
echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting Next.js application..."
npm run start
