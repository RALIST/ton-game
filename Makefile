build:
	docker-compose build
up:
	docker-compose up --remove-orphans
upd:
	docker-compose up -d --remove-orphans
down:
	docker-compose down --remove-orphans
buildup:
	docker-compose build && docker-compose up --remove-orphans
down-all:
	docker-compose down --volumes --remove-orphans

# I hope we wont need this command ever, but just in case
down-all-including-images:
	docker-compose down --volumes --remove-orphans --rmi all

restart:
	docker-compose restart $(ARGS)
