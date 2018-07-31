run:
	bundle exec middleman

deploy: clean build push-github

clean:
	rm -fR build

build:
	bundle exec middleman build

push-github:
	git branch -D gh-pages 2>/dev/null | true
	git branch -D gh-pages-draft 2>/dev/null | true
	git checkout -b gh-pages-draft && \
		git add -f build && \
		git commit -m "Deploy to gh-pages" && \
		git subtree split --prefix build -b gh-pages && \
		git push --force origin gh-pages:gh-pages && \
		git checkout -
