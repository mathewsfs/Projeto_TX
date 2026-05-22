up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f app

deploy:
	git pull
	docker compose build app
	docker compose up -d --no-deps app
	docker image prune -f

db-migrate:
	docker compose exec app npx prisma migrate deploy

db-studio:
	docker compose exec app npx prisma studio
