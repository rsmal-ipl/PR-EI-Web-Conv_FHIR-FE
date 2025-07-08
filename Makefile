.DEFAULT_GOAL := up

TARGET ?= development

build:
	docker-compose build --no-cache

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f pi_frontend

.PHONY: build up down logs 


# make build TARGET=development   # build para dev
# make build TARGET=production    # build para prod
# make build TARGET=build         # build para build
# make up                         # Inicia os containers
# make down                       # Desliga os containers
# make logs                       # Mostra logs do container pi_frontend
