PORT ?= 8013

run:
	python -m http.server $(PORT)

stop:
	fuser -k $(PORT)/tcp 2>/dev/null || true

fmt:
	black .

lint:
	flake8 .
	isort --check-only .

test:
	@echo "No tests for static site"

ci: fmt lint test
check: fmt lint test

diag:
	$(MAKE) check
