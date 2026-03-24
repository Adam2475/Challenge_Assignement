# Build Image

- alias d=docker
- d build -t mysql_image .
- d images

# Run Container

- d run --name mysql_container -p 3112:3306 mysql_image
- d ps

# Entering Container

- d exec -it mysql_container /bin/bash

# MySql

- mysql -u root -p
- id

<!-- WARN: SecretsUsedInArgOrEnv: Do not use ARG or ENV instruct -->

- docker compose up -d --build

# Removing

- docker system prune -a --volumes

# Regenerating (keep volumes and image)

- docker compose down -v
- docker compose up -d --build

# Test Seeding

- ./seed.sh