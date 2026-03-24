.PHONY: dev build start lint test deploy ssh logs

dev:
	bun run dev

build:
	NEXT_EXPERIMENTAL_TURBO=false bun run build

start:
	bun run start

lint:
	bun run lint

test:
	bun run test

test-watch:
	bun run test:watch

deploy:
	bash scripts/deploy.sh

ssh:
	ssh youtrack

logs:
	ssh youtrack "docker logs subs-manager --tail=50 -f"
