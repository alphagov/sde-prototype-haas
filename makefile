-include .env
export

APP_NAME ?= haas
ENV ?= development
FLASK_APP ?= $(APP_NAME):app
PORT ?= 8000
STATIC ?= $(APP_NAME)/static

.PHONY: clean
clean:
	find . \( -name '__pycache__' -and -not -name "venv" \) -d -prune -exec rm -r {} +

.PHONY: node-deps
node-deps:
	npm install

.PHONY: python-deps
python-deps:
	python -m pip install -U pip
	python -m pip install -r requirements.txt

.PHONY: deps
deps: node-deps python-deps

.PHONY: lint
lint:
	black --check .
	isort --check-only --profile=black --force-single-line-imports .
	flake8 --max-line-length=88 --extend-ignore=E203

.PHONY: lint-fix
lint-fix:
	pre-commit run --all-files

.PHONY: consent_api
consent_api:
	mkdir -p $(STATIC)/javascripts
	cp node_modules/@alphagov/consent-api/client/src/*.js $(STATIC)/javascripts/

.PHONY: assets
assets: consent_api
	flask assets build

.PHONY: run
run:
	flask --debug run --debugger --reload --port $(PORT)

.PHONY: docker-image
docker-image: assets
	docker buildx build --platform linux/amd64 -t $(APP_NAME) .

.PHONY: docker-run
docker-run:
	docker run -e PORT=$(PORT) -p $(PORT):$(PORT) $(APP_NAME)

docker-clean:
	docker container prune -f
