---
layout: main
title: Foundations-first delivery
description: CI, linters, secrets and observability before features.
permalink: /notes/foundations-first.html
---

# Foundations-first delivery

Why gates (CI/linters/secret scanning), request IDs and `/metrics` make features safer and faster to ship.

- Keep secrets out of git (use `.env`, scanning in CI)
- `/healthz` and `/metrics` from day 1
- Friendly 429s and structured JSON logs

Email [steven@okarthur.com](mailto:steven@okarthur.com) for the full checklist.
