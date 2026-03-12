

#!/bin/bash

# Test Execution Script for Playwright TypeScript Cucumber Framework
# Usage: ./scripts/run-tests.sh [options]

set -e

# Default values
ENV="dev"
BROWSER="chromium"
HEADED="false"
TAGS="@smoke"
PARALLEL="3"
RETRY="2"
REPORT_FORMAT="html"
CLEAN_REPORTS="true"
VERBOSE="false"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -e, --env ENV              Environment (dev, qa, prod) [default: dev]"
    echo "  -b, --browser BROWSER      Browser (chromium, firefox, webkit) [default: chromium]"
    echo "  -h, --headed               Run in headed mode [default: false]"
    echo "  -t, --tags TAGS            Cucumber tags to run [default: @smoke]"
    echo "  -p, --parallel COUNT       Number of parallel workers [default: 3]"
    echo "  -r, --retry COUNT          Number of retries for failed tests [default: 2]"
    echo "  -f, --format FORMAT        Report format (html, json, allure) [default: html]"
    echo "  --no-clean                 Don't clean reports before running"
    echo "  -v, --verbose              Verbose output"
    echo "  --help                     Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --env qa --browser firefox --tags '@regression'"
    echo "  $0 --headed --tags '@smoke or @critical'"
    echo "  $0 --env prod --tags '@api' --parallel 5"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--env)
            ENV="$2"
            shift 2
            ;;
        -b|--browser)
            BROWSER="$2"
            shift 2
            ;;
        -h|--headed)
            HEADED="true"
            shift
            ;;
        -t|--tags)
            TAGS="$2"
            shift 2
            ;;
        -p|--parallel)
            PARALLEL="$2"
            shift 2
            ;;
        -r|--retry)
            RETRY="$2"
            shift 2
            ;;
        -f|--format)
            REPORT_FORMAT="$2"
            shift 2
            ;;
        --no-clean)
            CLEAN_REPORTS="false"
            shift
            ;;
        -v|--verbose)
            VERBOSE="true"
            shift
            ;;
        --help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Validate environment
if [[ ! "$ENV" =~ ^(dev|qa|prod|t3|t5)$ ]]; then
    print_error "Invalid environment: $ENV. Must be one of: dev, qa, prod, t3, t5"
    exit 1
fi

# Validate browser
if [[ ! "$BROWSER" =~ ^(chromium|firefox|webkit)$ ]]; then
    print_error "Invalid browser: $BROWSER. Must be one of: chromium, firefox, webkit"
    exit 1
fi

# Print configuration
print_info "Test Configuration:"
echo "  Environment: $ENV"
echo "  Browser: $BROWSER"
echo "  Headed: $HEADED"
echo "  Tags: $TAGS"
echo "  Parallel: $PARALLEL"
echo "  Retry: $RETRY"
echo "  Report Format: $REPORT_FORMAT"
echo "  Clean Reports: $CLEAN_REPORTS"
echo "  Verbose: $VERBOSE"
echo ""

# Set environment variables
export ENV="$ENV"
export BROWSER="$BROWSER"
export HEADED="$HEADED"
export TAGS="$TAGS"
export PARALLEL="$PARALLEL"
export RETRY="$RETRY"
export VERBOSE="$VERBOSE"

# Clean reports if requested
if [[ "$CLEAN_REPORTS" == "true" ]]; then
    print_info "Cleaning previous reports..."
    rm -rf reports/*
    mkdir -p reports/{screenshots,videos,traces,cucumber-html,allure}
fi

# Install dependencies if needed
if [[ ! -d "node_modules" ]]; then
    print_info "Installing dependencies..."
    npm install
fi

# Install Playwright browsers if needed
if [[ ! -d "node_modules/@playwright/test" ]] || [[ ! -f ".playwright-browsers-installed" ]]; then
    print_info "Installing Playwright browsers..."
    npx playwright install
    touch .playwright-browsers-installed
fi

# Run tests based on tags
print_info "Starting test execution..."

if [[ "$TAGS" == *"@api"* ]]; then
    print_info "Running API tests..."
    npx cucumber-js --config cucumber.config.ts --tags "$TAGS" --parallel "$PARALLEL" --retry "$RETRY"
elif [[ "$TAGS" == *"@ui"* ]]; then
    print_info "Running UI tests..."
    npx cucumber-js --config cucumber.config.ts --tags "$TAGS" --parallel "$PARALLEL" --retry "$RETRY"
else
    print_info "Running all matching tests..."
    npx cucumber-js --config cucumber.config.ts --tags "$TAGS" --parallel "$PARALLEL" --retry "$RETRY"
fi

# Check test results
TEST_EXIT_CODE=$?

if [[ $TEST_EXIT_CODE -eq 0 ]]; then
    print_success "All tests passed!"
else
    print_error "Some tests failed (exit code: $TEST_EXIT_CODE)"
fi

# Generate reports
print_info "Generating reports..."

case $REPORT_FORMAT in
    "html")
        if [[ -f "reports/cucumber-report.json" ]]; then
            print_info "Generating HTML report..."
            npx cucumber-html-reporter --input reports/cucumber-report.json --output reports/cucumber-html/index.html
        fi
        ;;
    "allure")
        if [[ -f "reports/cucumber-report.json" ]]; then
            print_info "Generating Allure report..."
            mkdir -p reports/allure
            npx allure generate reports/allure --clean -o reports/allure-html
        fi
        ;;
    "json")
        print_info "JSON report available at: reports/cucumber-report.json"
        ;;
esac

# Show report locations
print_info "Reports generated:"
if [[ -f "reports/cucumber-html/index.html" ]]; then
    echo "  HTML Report: reports/cucumber-html/index.html"
fi
if [[ -f "reports/cucumber-report.json" ]]; then
    echo "  JSON Report: reports/cucumber-report.json"
fi
if [[ -d "reports/allure-html" ]]; then
    echo "  Allure Report: reports/allure-html/index.html"
fi
if [[ -d "reports/screenshots" ]]; then
    SCREENSHOT_COUNT=$(find reports/screenshots -name "*.png" 2>/dev/null | wc -l)
    echo "  Screenshots: $SCREENSHOT_COUNT files in reports/screenshots/"
fi
if [[ -d "reports/videos" ]]; then
    VIDEO_COUNT=$(find reports/videos -name "*.webm" 2>/dev/null | wc -l)
    echo "  Videos: $VIDEO_COUNT files in reports/videos/"
fi

# Performance summary
if [[ -f "reports/test-execution.log" ]]; then
    print_info "Performance Summary:"
    grep "PERFORMANCE:" reports/test-execution.log | tail -5
fi

# Final status
echo ""
if [[ $TEST_EXIT_CODE -eq 0 ]]; then
    print_success "Test execution completed successfully!"
else
    print_error "Test execution completed with failures!"
fi

exit $TEST_EXIT_CODE

