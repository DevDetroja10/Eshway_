#!/bin/bash
set -e

case "$1" in
base)
    echo "Running BASE tests..."
    # Run the existing http adapter tests
    npx mocha test/unit/adapters/http.js
    ;;
new)
    echo "Running NEW tests..."
    # Run your new failing test
    npx mocha test/specs/maxRate.spec.js
    ;;
*)
    echo "Usage: ./test.sh {base|new}"
    exit 1
    ;;
esac