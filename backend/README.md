# Backend

The primary setup and run instructions live in the repository root `README.md`.

## Quick Commands

When PHP is available locally:

```bash
composer install
php artisan migrate --seed
php artisan test
```

When using Docker:

```bash
docker compose exec backend composer install
docker compose exec backend php artisan migrate --seed
docker compose exec backend php artisan test
```
