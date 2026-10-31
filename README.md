# S4M Trust Bank

S4M Trust Bank is a simulated banking application built with Laravel, PostgreSQL, Blade, Bootstrap 5, and vanilla JavaScript. It is not connected to a real bank and must not be used for real financial activity.

## Requirements

- PHP 8.3+
- Composer
- PostgreSQL
- PHP `pdo_pgsql` and `pgsql` extensions

## Local setup

1. Create a PostgreSQL database (the current local configuration uses `Personal Bank`).
2. Copy `.env.example` to `.env` and set `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD`.
3. Run:

```text
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

Open `http://localhost:8000`. Registration creates a zero-balance bank account. Deposits and withdrawals are validated and recorded inside PostgreSQL transactions, and withdrawals lock the account row before checking the balance.

The existing static frontend source remains in `templates/`, `static/`, `css/`, and `js/`; Laravel serves the copied runtime assets from `public/css/` and `public/js/`. The old Django backend and SQLite database have been removed.
