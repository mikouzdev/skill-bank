## Structure

### Feature-based architecture.

#### app/

- root app components like App.tsx, router.
- providers like AuthProvider

#### features/

- business logic split by domain
- subfolders can be eg. consultant/ or sales/
- each feature has their components, pages and styling.

#### shared/

- components used in multiple features.

#### styles/

- app-wide styling, for example the MUI theme.

### layouts/

- layouts for the app and different pages.
