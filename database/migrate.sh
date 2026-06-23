#!/bin/bash
DB_NAME="${DB_NAME:-potager}"
DB_HOST="${DB_HOST:-localhost}"
DB_USER="${DB_USER:-$(whoami)}"

echo "=== Exécution des migrations ==="
for f in database/migrations/*.sql; do
    echo "  → $f"
    psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -f "$f"
done

echo ""
echo "=== Exécution des seeds ==="
for f in database/seeds/*.sql; do
    echo "  → $f"
    psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -f "$f"
done

echo ""
echo "Migration terminée."
