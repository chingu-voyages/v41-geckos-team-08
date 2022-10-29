# Work Order System

v41-geckos-team-08

## Tech Stack

[![Version](https://img.shields.io/badge/version-dev-green.svg)](https://shields.io/)
[![Release](https://img.shields.io/badge/release-0.1.0-blue.svg)](https://shields.io/)

![Express.Js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Node.Js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

## Description

The Work Order System defines users as either consumers or suppliers, with each creating an authenticated profile. The supplier will specify the product that they offer on signup. Consumers can search for products offered by different suppliers. After the consumer selects a supplier, both parties can negotiate the rates and time of completion. Afterwards, they'll both be required to indicate that the work order is complete.

This project is part of [Chingu's](https://chingu.io/) Voyage 41 cohort.

Objective was to reach a Minimum Viable Product (MVP) for the first release.

## Development Build

### Server Side

Clone the repo and inside the Server folder run:

```Command
npm install
```

this will install all of the required dependencies.  Also inside the Server folder it will need to create the ***.env*** file with the following keys:

> - **PORT** This will be the port in which the Server will run
>
> - **DATABASE_USERNAME** This will be the username for connecting to the postgres database
> - **DATABASE_PASSWORD** The password to connect to the postgres database
> - **DATABASE_HOST** The host where the database will be located for development it should be *localhost* or *127.0.0.1*
> - **DATABASE_NAME** The name of the database where the data is saved
> - **DATABASE_PORT** The port where the database server will listen for connections, it usually will be *5432*
>
> - **SECRET_KEY** The key with we will be generating the tokens, can be any string

## Production Build

## Team

<a href="https://github.com/chingu-voyages/v41-geckos-team-08/graphs/contributors"> <img src="https://contributors-img.firebaseapp.com/image?repo=chingu-voyages/v41-geckos-team-08" /> </a>
