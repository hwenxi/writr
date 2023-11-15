# writr
OpenAI API wrapper for 1-shot, 1-interaction queries

## TODO:
1. Prod configuration - SSL, OAuth (the prod compose file currently does not work)
2. Database migration - tools collection, users

## To run
1. [Install Pocketbase for your architecture](https://pocketbase.io/docs/) in the backend folder
3. In deployment/docker_compose/ copy env.template to .env and fill with necessary information. For Pocketbase credentials, fill in what you plan to submit to Pocketbase
4. In web/hooks.server.ts comment out the default localhost target for Pocketbase and uncomment the reverse proxy url
5. Run the docker compose file: docker compose -f docker-compose.dev.yml -p writr-stack up -d --build --force-recreate
6. Open localhost:81/pocketbase//_/ and set the admin user and pw
### Database migration (todo)
1. Create a user for auth with the same credentials as you put in the .env file, include a new field "creator"
2. Create a tools collection (specs. todo)
