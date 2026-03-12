# Spankki

## Deploy

Deploy to Azure from branch Azure_deployment. You can use versioned branches to update development branch and cherry pick to Azure_deployment when needed. You can also rebase development to Azure_deployment for instant pipeline update (and save Gitlab free CI/CD credits).

CI/CD yaml is live on branch Azure_deployment to save the free credits.

## Name

Spankki

## Description

Spankki is an abbreviation of Skill-Pankki which is informationsystem which contains skills information bank for a consulting company. Bank contains salespeople, consultants and offers for customers.

## Installation

To install Spankki to Azure you need to create two Azure web services and Azure postgresql database. You might have to have to add client's ip to your server's cors settings in backend's app.ts file. You can use example in Azure_deployment branch.

1. You also need two dockerfiles for each client and server. Examples are found also in Azure_deployment branch.
2. In Azure client you need to setup DATABASE_URL which points to your Azure's database.
3. You need to setup CI/CD variables which corresponds to the Azures values.
4. Note that first time you need to run database setup commands as well. In .gitlab-ci.yml have all the commands to push the image to Azure registy (and lint the code before hand.).

## Test

Testing is implemented with Cypress and run in Testpipeline using Gitlab's CI/CD pipeline.

## Usage

Each user of the bank can login and view certain portions of the bank. Users may have multiple roles to choose their role for the session.

# Consultant

Consultant can login and view and edit their own profile. Consultant may also view public information on profiles of other consultants. Consultants may also recieve and reply from comments sent by salesperson.

# Salesperson

Salesperson can login and view all information of consultant profiles. Salesperson can create an offer and sent it to a customer to view. Offers may contain a consultant profile for customer to analyze. Sales can set

# Admin

Admins can manage users and skill tags for consultants.

# Customer

Customers can login through an unique link sent to them by salesperson. Customers have a password to access an offer made by a salesperson. Customer may view and analyse consultants suggested by the sales person.

## Support

Contact the person who sent this repo.

## Authors and acknowledgment

Juola Daniel, backend and backend testing.
Kortelainen Miko, frontend and ui/ux design.
Koivurova Ville, frontend and frontend testing.
Rantanen Nuutti, project design, fullstack, ci/cd and devops.

## Project status

Project has been concluded since course has ended.
