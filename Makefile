PORT ?= 8013

run:
\tpython -m http.server $(PORT)

stop:
\tfuser -k $(PORT)/tcp 2>/dev/null || true

fmt:
\tblack .

lint:
\tflake8 .
\tisort --check-only .

test:
\t@echo "No tests for static site"

ci: fmt lint test
check: fmt lint test

diag:
\t$(MAKE) check
