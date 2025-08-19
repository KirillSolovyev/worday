# Worday

An educational project designed to enhance language learning through daily AI-powered word discovery. Every day, users receive a new word along with AI-generated examples and interactive learning assistance, making the language learning process engaging

## Tech Stack

- **Backend**: NestJS (TypeScript-based Node.js framework)
- **Database**: PostgreSQL with TypeORM for data management
- **AI Integration**: Google Gemini AI for word generation and examples
- **User Interface**: Telegram Bot API for user interactions
- **Infrastructure**: Docker & Docker Compose
- **Deployment**: AWS EC2
- **CI/CD**: GitHub Actions
- **Testing**: Jest for e2e testing

## How to run

### Local Development with Docker Compose

The project uses Docker Compose for easy local development with hot reload capabilities and automatic container synchronization.

1. Set up environment variables in .env file:

   ```bash
   DOCKER_BUILD_TARGET="dev"
   ```

2. Start the development environment:

   ```bash
   docker-compose up --build --watch
   ```

   - `--build`: Ensures the latest development image is built
   - `--watch`: Enables hot reload and automatic rebuilds on code changes

### Production Deployment

#### Docker Compose Production Build

1. Set the production environment:

   ```bash
   export DOCKER_BUILD_TARGET="prod"
   ```

2. Build and run production containers:
   ```bash
   docker-compose up --build
   ```

#### AWS EC2 Deployment

1. Provision an EC2 instance with Docker and Docker Compose installed
2. Configure security groups to allow:

   - Inbound traffic on port 80 (HTTP)
   - Inbound traffic on port 443 (HTTPS)
   - Custom port for Telegram Bot webhook (if applicable)

3. Clone the repository and set up environment variables
4. Run the production Docker Compose setup

## CI/CD with GitHub Actions

The project uses GitHub Actions for automated workflows:

**Deployment Pipeline**

- Triggers on merge to main branch
- Builds Docker images
- Runs security scans
- Deploys to AWS EC2 using Docker Compose
- Performs health checks post-deployment

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
