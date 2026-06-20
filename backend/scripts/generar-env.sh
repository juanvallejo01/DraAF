#!/bin/bash

echo "Generando configuración segura para el Backend de DraAF..."

# Moverse al directorio del backend
cd "$(dirname "$0")/.." || exit

ENV_FILE=".env"

if [ -f "$ENV_FILE" ]; then
    echo "⚠️ Ya existe un archivo .env. ¿Deseas sobrescribirlo? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Operación cancelada."
        exit 0
    fi
fi

# Generar JWT Secret de 64 caracteres en base64
JWT_SECRET=$(openssl rand -base64 48)

# Generar WHATSAPP_APP_SECRET de 32 caracteres en base64
WHATSAPP_APP_SECRET=$(openssl rand -base64 24)

# Generar WHATSAPP_VERIFY_TOKEN de 16 caracteres hexadecimales
WHATSAPP_VERIFY_TOKEN=$(openssl rand -hex 8)

cat <<EOT > "$ENV_FILE"
# Entorno
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000

# Base de datos (MongoDB)
MONGODB_URI=mongodb://localhost:27017/draaf

# Seguridad
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d

# WhatsApp Cloud API / Evolution API
WHATSAPP_API_URL=https://graph.facebook.com/v19.0
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_VERIFY_TOKEN=$WHATSAPP_VERIFY_TOKEN
WHATSAPP_APP_SECRET=$WHATSAPP_APP_SECRET

# Redis (Opcional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
EOT

echo "✅ Archivo .env generado exitosamente en backend/.env"
echo "🔒 Se han generado tokens seguros y dinámicos para JWT y Webhooks de WhatsApp."
echo "⚠️ Por favor edita el archivo e ingresa tu MONGODB_URI y las credenciales de WhatsApp si vas a pasar a producción."
