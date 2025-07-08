.DEFAULT_GOAL := up

TARGET ?= development

build:
	docker-compose build --no-cache
	docker-compose up -d

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f pi_frontend

prod:
	docker-compose -f docker-compose.production.yml --env-file .env.production up --build -d

.PHONY: build up down logs prod
