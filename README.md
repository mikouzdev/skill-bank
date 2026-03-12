# Spankki

## Deploy

Deploy to Azure from the `Azure_deployment` branch.

You can use versioned branches to update the development branch and cherry-pick changes to `Azure_deployment` when needed.  
Alternatively, you can rebase the development branch onto `Azure_deployment` for an instant pipeline update (and to save GitLab free CI/CD credits).

The CI/CD YAML file is intentionally kept only on the `Azure_deployment` branch to preserve free pipeline minutes.

## Name

Spankki

## Description

Spankki is short for **Skill-Pankki** — a skill information system (skills bank) for a consulting company.

The system contains information about:

- salespeople
- consultants
- customer offers

## Installation (Azure)

To deploy Spankki to Azure, you need to create:

- two Azure Web Apps (one for client, one for server)
- one Azure PostgreSQL database

You may need to add the client's IP address to the CORS settings in the backend's `app.ts` file (example available in the `Azure_deployment` branch).

Steps:

1. Create two Dockerfiles — one for the client and one for the server.  
   Examples are available in the `Azure_deployment` branch.

2. In the Azure **client** Web App, set the environment variable:  
   `DATABASE_URL` → connection string to your Azure PostgreSQL database

3. Set up the required CI/CD variables in GitLab that match your Azure resource values.

4. **Important**: The first deployment requires running database setup / migration commands.  
   All necessary commands (including pushing images to Azure Container Registry and linting) are defined in `.gitlab-ci.yml`.

## Testing

End-to-end testing is implemented with **Cypress** and runs automatically in the test pipeline using GitLab CI/CD.

## Usage

Users log in to Spankki and can view different parts of the system depending on their role(s).  
A user may have multiple roles and can choose which one to use for the current session.

### Consultant

- View and edit their own profile
- View public information of other consultants' profiles
- Receive and reply to comments from salespeople

### Salesperson

- View all information from consultant profiles
- Create offers and send them to customers
- Include selected consultant profiles in offers for customers to review

### Admin

- Manage users
- Manage skill tags for consultants

### Customer

- Log in via a unique link sent by a salesperson
- Use a password to access a specific offer
- View and analyze the consultant(s) suggested for their project

## Support

Contact the person who shared this repository with you.

## Authors & Acknowledgments

- **Juola Daniel** — Backend & backend testing
- **Kortelainen Miko** — Frontend & UI/UX design
- **Koivurova Ville** — Frontend & frontend testing
- **Rantanen Nuutti** — Project design, full-stack development, CI/CD & DevOps

## Project Status

The project has been concluded as the course has ended.
