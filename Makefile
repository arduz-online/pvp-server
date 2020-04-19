PROTOC ?= protoc

.SUFFIXES:

BUILDER = $(PWD)/node_modules/.bin/ulla-builder

install_mac: install

install_ubuntu: install

install:
	npm install
	npm i -S arduz-sdk@next

build: export NODE_ENV=production
build:
	$(BUILDER)

watch_sources: export NODE_ENV=development
watch_sources:
	$(BUILDER) --watch

update_ulla:
	npm i -S ulla-builder@next

# links dependencies, builds itself and expose linked module
link:
	npm link
	npm link arduz-sdk
	$(MAKE) build

watch: watch_sources

.PHONY: build watch_sources