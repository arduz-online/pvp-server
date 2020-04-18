PROTOC ?= protoc

.SUFFIXES:

BUILDER = $(PWD)/node_modules/.bin/ulla-builder

install_mac: install

install_ubuntu: install

install:
	npm install

build: export NODE_ENV=production
build:
	$(BUILDER)

watch_sources: export NODE_ENV=development
watch_sources:
	$(BUILDER) --watch

update_ulla:
	npm i -S ulla-compiler@next ulla-ecs@next

# links dependencies, builds itself and expose linked module
link:
	npm link arduz-sdk
	$(MAKE) build
	npm link

watch: watch_sources

.PHONY: build watch_sources