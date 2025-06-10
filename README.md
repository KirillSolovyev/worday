# Worday

The app to learn a new word everyday

## How to run

### Locally

We use Docker compose with develop mode to enable hot reload and automatic container sync/rebuild

You need to set the env var `DOCKER_BUILD_TARGET="dev"`

```
docker-compose up --build --watch
```

`--build` - makes sure that the latest built image was build for dev mode (docker-compose reuse existing images)
'--watch' - runs docker in the watch mode

### Staging/Production

To make a staging/production build run you need to set the env var `DOCKER_BUILD_TARGET="prod"` and run

```
docker-compose up --build
```

## Features list

### Basic

1. Generates a new word with examples on any language every day with the AI
2. Asks for a few sentences from the user to wrap up the new word
3. Evaluates the user's language proficiency in the beginning
4. User interacts with the app via Telegram UI (API)

### Advanced

#### Area of the words

1. Asks a user about the area of the words he wants to study, for example, work, business, everyday
2. Ability to change the area at any time

#### Analytics

1. Every week shows the analytics about the learned words
