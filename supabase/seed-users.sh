#!/usr/bin/env bash
# Crea los 3 usuarios de prueba via GoTrue admin API.
# Idempotente: si ya existen, GoTrue devuelve 422 y se ignora.
#
# Uso:
#   SUPABASE_URL=http://localhost:8000 \
#   SERVICE_ROLE_KEY=eyJ... \
#   ./supabase/seed-users.sh

set -euo pipefail

: "${SUPABASE_URL:?Falta SUPABASE_URL}"
: "${SERVICE_ROLE_KEY:?Falta SERVICE_ROLE_KEY}"

USERS=(
  "admin@localhost:admin:Admin"
  "tecnico@localhost:tecnico:Tecnico"
  "recepcion@localhost:recepcion:Recepcion"
)

PASSWORD="puntocell123"

for entry in "${USERS[@]}"; do
  IFS=':' read -r email rol nombre <<< "$entry"
  echo "→ $email ($rol)"
  curl -sS -X POST "$SUPABASE_URL/auth/v1/admin/users" \
    -H "apikey: $SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$email\",\"password\":\"$PASSWORD\",\"email_confirm\":true,\"user_metadata\":{\"nombre\":\"$nombre\",\"rol\":\"$rol\"}}" \
    | head -c 120
  echo
done

echo
echo "Listo. Probar login con cualquiera de los emails + contraseña: $PASSWORD"
