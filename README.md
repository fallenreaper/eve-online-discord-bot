# EveOnline Discord Bot
## AboraBot

The purpose of this bot is to help manage different aspects of EveOnline Chatter.

### Installation
To prep this for consumption, the bot will need to have its service running as well as its Database.
- Ensure you have installed Docker onto your system.  See: docker.com
- Ensure you have installed NodeJs onto your system.  See: nodejs.org
- Run: `docker run -rm -it -d -p5432:5432 --name eve-db fallenreaper/eve-postgres`
- Ensure you have a BOT Id you wish to use and add it to the src/config.json file, for "token" 
- From the Root Directory, Run: `npm install`
- From the Root Directory, Run: `npm start`

### TODO:
I need to have the following items in place in order.
[ ] Basic Bot Implementation
[ ] Mechanism to query postgres.
[ ] Initial setup of tasks it will be utilized for.
  - [ ] Keywords related to tasks.
  - [ ] Implementation of queries.
  - [ ] Run tests.
