#!/bin/sh
set -e

echo "🔄 Aplicando schema do banco de dados..."
node /app/prisma-push.mjs

echo "🚀 Iniciando servidor Next.js..."
exec node server.js
