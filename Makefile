PROJECT_NAME=`basename $(CURDIR)`
IMAGE_NAME=arig/$(PROJECT_NAME)
IMAGE_VERSION=local

ALL=dist node_modules

build:
	docker build -t $(IMAGE_NAME):$(IMAGE_VERSION) .

debug:
	docker run -it --rm $(IMAGE_NAME):$(IMAGE_VERSION) sh

run:
	docker run -it --rm -p 0:80 $(IMAGE_NAME):$(IMAGE_VERSION)

clean:
	rm -Rf $(ALL)
