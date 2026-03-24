#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Seed appdb inside the running mysql compose container.
docker exec -i mysql_container mysql -uroot -proot < "$SCRIPT_DIR/seed.sql"

echo "Seeding completed."
