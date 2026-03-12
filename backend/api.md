# API Endpoints

To get API and documentation of all endpoints:

1. Run `pnpm run dev` in backend folder (make sure server setup is done first!)
2. Navigate to `http://localhost:3000/docs/#/` in browser

Note that endpoints will not function if the database is not running. Follow instructions in database.md to setup server and run database.

Many endpoints require authentication/authorization:

1. Use /auth/login endpoint to send the following body (make sure database is running!):
```
{
  "email": "test@demo.com",
  "password": "hashed-password"
}
```
2. Response body should include token. Copy the token.
3. Click "Authorize" in top right corner of the page.
4. Paste token into value field.
5. Click "Authorize".
6. Close.

You will now be logged in and can access all endpoints. You can log out either with the /auth/logout endpoint or with "Authorize" button.