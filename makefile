APP_NAME=haas
DOCKER_REPO=gcr.io/govuk-bigquery-analytics
VERSION=$(shell cat version)

local-dev:
	flask --app $(APP_NAME):app --debug run --debugger --reload

docker-build:
	docker buildx build --platform linux/amd64 -t $(APP_NAME) .

docker-tag:
	docker tag $(APP_NAME) $(APP_NAME):$(VERSION)
	docker tag $(APP_NAME) $(DOCKER_REPO)/$(APP_NAME):$(VERSION)

docker-push:
	docker push $(DOCKER_REPO)/$(APP_NAME):$(VERSION)

docker-run:
	docker run -e PORT=8080 -p 8080:8080 $(APP_NAME)

docker-clean:
	docker container prune -f