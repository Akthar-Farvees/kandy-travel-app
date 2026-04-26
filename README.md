# Kandy Travel App

Full-stack interview task implementation for a Kandy-focused travel and lifestyle products experience.

## Stack

- Frontend: React + Vite + TypeScript
- Backend: Laravel 11 API + Sanctum personal access tokens
- Database: MySQL 8
- Local runtime: Docker Compose
- Intended deployment: React on Vercel, Laravel API on Railway, MySQL on Railway

## Database Mode

- Local non-Docker runtime: MySQL
- Docker runtime: MySQL
- SQLite is not used for the application runtime

## Requirements Coverage

- Kandy is stored in the database and exposed through the API
- Public product listing supports search, category filtering, price filtering, and voice prompt filtering
- Admin users can log in, create products, edit products, delete products, and control product visibility
- Backend validation, seed data, CORS, and API error responses are included
- Frontend includes loading states, empty states, responsive layouts, and a dedicated admin panel

## Local Development With Docker

1. Create the backend environment file if it does not exist yet:

```bash
Copy-Item backend\.env.example backend\.env
```

2. Start the stack:

```bash
docker compose up --build
```

3. Run database migrations and seeders:

```bash
docker compose exec backend php artisan migrate --seed
```

4. Open the apps:

- Frontend: `http://localhost:5173`
- Laravel API: `http://localhost:8000/api/v1`
- Laravel health check: `http://localhost:8000/up`

## Local Development Without Docker

1. Make sure MySQL is running locally.
2. Create a database named `kandy_travel`.
3. Update `backend/.env` if your local MySQL host, port, username, or password differ from the defaults.
4. Install backend dependencies:

```bash
cd backend
php ../composer.phar install
```

5. Run migrations and seeders:

```bash
php artisan migrate --seed
```

6. Start Laravel:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

## Admin Access

- Email: `admin@kandy.lk`
- Password: `password`

## Frontend Commands

```bash
cd frontend
npm install
npm run lint
npm run build
```

## Backend Commands

When PHP is available locally:

```bash
cd backend
composer install
php artisan migrate --seed
php artisan test
```

When PHP is not available locally, use Docker:

```bash
docker compose exec backend composer install
docker compose exec backend php artisan migrate --seed
docker compose exec backend php artisan test
```

## Environment Variables

### Frontend

- `VITE_API_URL`

### Backend

- `APP_URL`
- `FRONTEND_URL`
- `DB_CONNECTION`
- `DB_HOST`
- `DB_PORT`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`
- `CORS_ALLOWED_ORIGINS`
- `SANCTUM_STATEFUL_DOMAINS`

## API Summary

### Public

- `GET /api/v1/location`
- `GET /api/v1/products`
- `GET /api/v1/products/categories`
- `GET /api/v1/products/{id}`

### Auth

- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`

### Admin

- `GET /api/v1/admin/products`
- `POST /api/v1/admin/products`
- `PUT /api/v1/admin/products/{id}`
- `DELETE /api/v1/admin/products/{id}`

## Notes

- The frontend build passes with the included package versions.
- The application runtime uses MySQL in both local and Docker modes.
- PHPUnit is still configured for in-memory SQLite test isolation by default.
- Voice search uses the browser Web Speech API through `react-speech-recognition`, with a visible fallback when unsupported.
