PROTOC ?= protoc

.SUFFIXES:

BUILDER = $(PWD)/node_modules/.bin/ulla-builder

install_mac: install

install_ubuntu: install

install:
	npm install
	npm i -S arduz-sdk@next
	npm i -D arduz-host@next
	npm i -D ulla-builder@next

build: export NODE_ENV=production
build:
	$(BUILDER)

watch: export NODE_ENV=development
watch:
	$(BUILDER) --watch

update_ulla:
	npm i -S ulla-builder@next
	npm i -S arduz-sdk@next

link-builder:
	ln -svfh ../../../ulla/packages/ulla-builder/index.js node_modules/.bin/ulla-builder

# links dependencies, builds itself and expose linked module
link:
	npm link
	npm link arduz-sdk
	$(MAKE) build

watch-sdk:
	cd ../arduz-sdk; $(MAKE) watch

watch-with-sdk:
	cd ../arduz-sdk; $(MAKE) install build
	cd ../arduz-sdk; npm link
	npm link arduz-sdk
	npx concurrently \
		-n "sdk,pvp" \
			"make watch-sdk" \
			"make watch"
	$(MAKE) watch

run-debug-server:
	$(PWD)/node_modules/.bin/arduz-host

.PHONY: build watch_sources