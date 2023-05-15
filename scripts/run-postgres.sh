docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=12345 \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  --name cocktail-library-postgres \
  postgres:15.2-alpine
