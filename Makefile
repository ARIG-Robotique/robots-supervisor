PROJECT_NAME=`basename $(CURDIR)`
IMAGE_NAME=ghcr.io/arig-robotique/$(PROJECT_NAME)
IMAGE_VERSION=local

ALL=dist node_modules

build:
	yarn install
	yarn run build
	docker build --cache-from $(IMAGE_NAME):latest -t $(IMAGE_NAME):$(IMAGE_VERSION) .

debug:
	docker run -it --rm $(IMAGE_NAME):$(IMAGE_VERSION) sh

run:
	docker run -it --rm -p 0:80 $(IMAGE_NAME):$(IMAGE_VERSION)

clean:
	rm -Rf $(ALL)
