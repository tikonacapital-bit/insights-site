# Tikona Insights

Standalone blog site for `insights.tikonacapital.com`.

## Run

```bash
npm install
npm run dev
```

## Environment

Copy `.env.example` to `.env` and set:

- `VITE_STRAPI_URL`
- `VITE_SITE_URL`

## Routes

- `/` - blog archive
- `/:slug` - article detail
- `/post/:slug` - compatibility route
