.PHONY: test

install:
	spago install
	spago bundle-app --to prod/index.js

start:
	parcel public/index.html --out-dir dist --open

build:
	mkdir -p prod
	cp -r public/* prod/
	rm -rf dist
	spago bundle-app --to prod/index.js
	parcel build prod/index.html

test:
	spago test
