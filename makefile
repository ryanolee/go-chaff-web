build:
	$(MAKE) -C go build
	
serve:
	python3 -m http.server --directory public

