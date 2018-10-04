PATH := node_modules/.bin:$(PATH)

all: lint test clean build

lint: node_modules
	tslint -p .

test: node_modules
	# jest

clean:
	rm -rf lib

build: node_modules
	tsc -d -m commonjs --outDir lib

release: all
	git add lib
	standard-version -a

node_modules: package.json
	yarn && touch $@

.PHONY: all lint test clean build release
