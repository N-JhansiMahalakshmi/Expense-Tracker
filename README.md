# Expense Tracker

A React + Vite expense tracker styled as a ledger book, with login/logout, and a view of how your spending is tracking against income and a savings goal.

## Auth — read this first
Login/signup here is **browser-only and for demo purposes**, exactly as requested (pure React, no backend). Accounts and passwords are stored in `localStorage` on whatever device/browser you're using — not encrypted, not synced, not recoverable if cleared. Do not reuse a real password. If you later want real authentication, the natural next step given your Django background is a Django REST Framework API issuing JWTs, with React holding the token and sending it on each request — happy to help you build that when you're ready.

## What's inside
- `auth/AuthContext.jsx` — signup/login/logout, session persisted in `localStorage`
- `auth/AuthScreen.jsx` — combined login/signup form
- `ExpenseForm.jsx` / `ExpenseList.jsx` — add and remove expenses, ledger-style rows
- `Summary.jsx` — total spent + category breakdown
- `SavingsPanel.jsx` — enter monthly income and a savings goal; shows spending rate (% of income spent so far), how much you're on pace to save, and whether that's ahead or behind your goal
- `categoryColors.js` — shared category color mapping
- `App.jsx` — gates the ledger behind auth, scopes expenses and savings goals per logged-in user

## Design
Paper background, IBM Plex Serif for headings, IBM Plex Mono for every figure so amounts line up. Ruled rows for the expense list, color-coded category chips, a proportional bar for both category split and spending rate.

## Run it locally
```bash
npm install
npm run dev
```
Then open the URL Vite prints (usually `http://localhost:5173`). Sign up with any username/password to create your first ledger.
