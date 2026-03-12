# Frontend

## Technologies used

- React.js
- Material UI

## Images

- [Consultant profile](./docs/consultant1.png)
- [Consultant profile editing](./docs/consultant2.png)
- [Sales offer creation](./docs/sales1.png)
- [Sales list of consultants](./docs/sales2.png)
- [Admin user management](./docs/admin1.png)
- [Customer offer page](./docs/customer1.png)

## What can the user do?

### As a consultant

- View and edit own personal details.
- Add employments, projects, skills, and external links to profile.
- Reply to comments made by sales personnel.
- View other consultants public profiles.

### As a salesperson

- View and search consultant profiles.
- Create and edit offers for customers.
- Create lists of consultants.
- Create new skills and skill categories for consultants.
- Comment on consultants profile sections.

### As a customer

- View an offer page with a unique link and a password.
- View offers consultants and their profiles.
- Set consultants as accepted in the offer.

### As an admin

- Create and delete users.
- Change users roles.
- Create new skills and skill categories for consultants.

## Authentication

User authentication in this project is done by using a JWT (JSON Web Token), which is signed by the backend with a secret, and stored in the browsers local storage after logging in. The token is send in a authorization header with every request, to allow accessing authenticated endpoints. (see [api.ts](./src/shared/api/api.ts))

## Folder structure

The frontend of this project uses a feature-based architecture, meaning the logic is split by feature basis, and a shared folder is used if same logic or components are used in multiple features.

```
/frontend
├── src
│   ├── app
│   │   ├── hooks
│   │   ├── layout
│   │   └── providers
│   ├── features
│   │   ├── admin
│   │   ├── consultant
│   │   ├── customer
│   │   ├── login
│   │   ├── logout
│   │   └── sales
│   └── shared
│       ├── api
│       ├── components
│       ├── hooks
│       └── pages
└── ...
```

### Important package.json scripts

- `pnpm run dev`: Runs the frontend in development mode.
- `pnpm run lint`: Uses eslint to lint the frontend directory.
- `pnpm run typecheck`: Stricter type validation, compiles the frontend without emitting output files.
