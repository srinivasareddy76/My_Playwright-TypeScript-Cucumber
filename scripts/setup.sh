


#!/bin/bash

# Setup Script for Playwright TypeScript Cucumber Framework
# This script sets up the testing environment and installs all dependencies

set -e

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
        
        if [[ $MAJOR_VERSION -ge 16 ]]; then
            print_success "Node.js version $NODE_VERSION is compatible"
            return 0
        else
            print_error "Node.js version $NODE_VERSION is not supported. Please install Node.js 16 or higher"
            return 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 16 or higher"
        return 1
    fi
}

# Function to check npm version
check_npm_version() {
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        print_success "npm version $NPM_VERSION is available"
        return 0
    else
        print_error "npm is not installed"
        return 1
    fi
}

# Function to install Node.js dependencies
install_dependencies() {
    print_info "Installing Node.js dependencies..."
    
    if [[ -f "package.json" ]]; then
        npm install
        print_success "Dependencies installed successfully"
    else
        print_error "package.json not found"
        return 1
    fi
}

# Function to install Playwright browsers
install_browsers() {
    print_info "Installing Playwright browsers..."
    
    npx playwright install
    npx playwright install-deps
    
    # Mark browsers as installed
    touch .playwright-browsers-installed
    
    print_success "Playwright browsers installed successfully"
}

# Function to create environment file
create_env_file() {
    print_info "Creating environment configuration..."
    
    if [[ ! -f ".env" ]]; then
        cat > .env << EOF
# Environment Configuration
ENV=dev
BROWSER=chromium
HEADED=false
VIEWPORT=desktop
TIMEOUT=30000
SLOW_MO=0
PARALLEL=3
RETRY=2
DEBUG=false
VERBOSE=false

# URLs
BASE_URL=https://frbsf.org
API_URL=https://api.frbsf.org

# Authentication
API_TOKEN=your_api_token_here
CLIENT_ID=your_client_id_here
CLIENT_SECRET=your_client_secret_here

# Database
DB_HOST=localhost
DB_PORT=1521
DB_SERVICE=TESTDB
DB_USERNAME=testuser
DB_PASSWORD=testpass

# Reporting
REPORT_PATH=./reports
SCREENSHOT_PATH=./reports/screenshots
VIDEO_PATH=./reports/videos
TRACE_PATH=./reports/traces

# Logging
LOG_LEVEL=info
LOG_CONSOLE=true
LOG_FILE=true
LOG_FILE_PATH=./reports/test-execution.log

# Features
ENABLE_VIDEO_RECORDING=true
ENABLE_SCREENSHOTS=true
ENABLE_TRACING=true
ENABLE_NETWORK_LOGS=false

# CI/CD
CI=false
PUBLISH_RESULTS=false
FAIL_FAST=false
DRY_RUN=false

# Performance
PAGE_LOAD_TIMEOUT=5000
API_RESPONSE_TIMEOUT=2000
RESOURCE_LOAD_TIMEOUT=3000

# Security
ENABLE_SSL_VERIFICATION=true
ALLOW_SELF_SIGNED_CERTS=false

# Client Certificates (if needed)
# CLIENT_CERT_PATH=./certs/client-cert.pfx
# CLIENT_KEY_PATH=./certs/client-key.pem
# CLIENT_CERT_PASSPHRASE=your_passphrase
# CA_CERT_PATH=./certs/ca-cert.pem
EOF
        print_success "Environment file created: .env"
        print_warning "Please update the .env file with your actual configuration values"
    else
        print_info ".env file already exists, skipping creation"
    fi
}

# Function to create directory structure
create_directories() {
    print_info "Creating directory structure..."
    
    # Create all necessary directories
    mkdir -p reports/{screenshots,videos,traces,cucumber-html,allure}
    mkdir -p logs
    mkdir -p temp
    
    print_success "Directory structure created"
}

# Function to set up git hooks (if git repo exists)
setup_git_hooks() {
    if [[ -d ".git" ]]; then
        print_info "Setting up git hooks..."
        
        # Create pre-commit hook
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Pre-commit hook for test framework

echo "Running pre-commit checks..."

# Check for TypeScript compilation errors
if command -v npx >/dev/null 2>&1; then
    echo "Checking TypeScript compilation..."
    npx tsc --noEmit
    if [[ $? -ne 0 ]]; then
        echo "TypeScript compilation failed. Please fix errors before committing."
        exit 1
    fi
fi

# Run linting (if ESLint is configured)
if [[ -f ".eslintrc.js" ]] || [[ -f ".eslintrc.json" ]]; then
    echo "Running ESLint..."
    npx eslint . --ext .ts,.js
    if [[ $? -ne 0 ]]; then
        echo "Linting failed. Please fix errors before committing."
        exit 1
    fi
fi

# Check for sensitive data in commits
echo "Checking for sensitive data..."
if grep -r "password\|secret\|token\|key" --include="*.ts" --include="*.js" --include="*.json" . | grep -v "node_modules" | grep -v ".git" | grep -v "example\|placeholder\|your_"; then
    echo "Warning: Potential sensitive data found in files. Please review before committing."
    echo "If this is intentional, you can skip this check with --no-verify"
    exit 1
fi

echo "Pre-commit checks passed!"
EOF
        
        chmod +x .git/hooks/pre-commit
        print_success "Git hooks set up successfully"
    else
        print_info "Not a git repository, skipping git hooks setup"
    fi
}

# Function to validate setup
validate_setup() {
    print_info "Validating setup..."
    
    local errors=0
    
    # Check if all required files exist
    required_files=(
        "package.json"
        "tsconfig.json"
        "playwright.config.ts"
        "cucumber.config.ts"
        "core/world/customWorld.ts"
        "core/base/basePage.ts"
        "core/base/baseAPI.ts"
    )
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            print_error "Required file missing: $file"
            ((errors++))
        fi
    done
    
    # Check if directories exist
    required_dirs=(
        "applications"
        "api"
        "core"
        "config"
        "reports"
        "scripts"
        "credentials"
        "certs"
    )
    
    for dir in "${required_dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            print_error "Required directory missing: $dir"
            ((errors++))
        fi
    done
    
    # Check if node_modules exists
    if [[ ! -d "node_modules" ]]; then
        print_error "node_modules directory missing. Dependencies may not be installed."
        ((errors++))
    fi
    
    # Check if Playwright browsers are installed
    if [[ ! -f ".playwright-browsers-installed" ]]; then
        print_warning "Playwright browsers may not be installed"
    fi
    
    if [[ $errors -eq 0 ]]; then
        print_success "Setup validation passed!"
        return 0
    else
        print_error "Setup validation failed with $errors errors"
        return 1
    fi
}

# Function to run a quick test
run_quick_test() {
    print_info "Running quick test to verify setup..."
    
    # Try to compile TypeScript
    if command_exists npx; then
        npx tsc --noEmit
        if [[ $? -eq 0 ]]; then
            print_success "TypeScript compilation successful"
        else
            print_error "TypeScript compilation failed"
            return 1
        fi
    fi
    
    # Try to run a simple cucumber command
    npx cucumber-js --version >/dev/null 2>&1
    if [[ $? -eq 0 ]]; then
        print_success "Cucumber.js is working"
    else
        print_error "Cucumber.js is not working properly"
        return 1
    fi
    
    print_success "Quick test passed!"
}

# Function to show next steps
show_next_steps() {
    print_info "Setup completed! Next steps:"
    echo ""
    echo "1. Update the .env file with your actual configuration values"
    echo "2. Add your test credentials to credentials/users.json"
    echo "3. Add SSL certificates to certs/ directory (if needed)"
    echo "4. Run your first test:"
    echo "   ./scripts/run-tests.sh --tags @smoke"
    echo ""
    echo "Available scripts:"
    echo "  ./scripts/run-tests.sh     - Run tests"
    echo "  ./scripts/generate-report.sh - Generate reports"
    echo "  ./scripts/cleanup.sh       - Clean up test artifacts"
    echo ""
    echo "For help with any script, use --help flag"
}

# Main setup function
main() {
    print_info "Starting Playwright TypeScript Cucumber Framework Setup..."
    echo ""
    
    # Check prerequisites
    print_info "Checking prerequisites..."
    check_node_version || exit 1
    check_npm_version || exit 1
    
    # Install dependencies
    install_dependencies || exit 1
    
    # Install browsers
    install_browsers || exit 1
    
    # Create environment file
    create_env_file
    
    # Create directories
    create_directories
    
    # Set up git hooks
    setup_git_hooks
    
    # Make scripts executable
    print_info "Making scripts executable..."
    chmod +x scripts/*.sh
    
    # Validate setup
    validate_setup || exit 1
    
    # Run quick test
    run_quick_test || exit 1
    
    # Show next steps
    show_next_steps
    
    print_success "Setup completed successfully!"
}

# Run main function
main "$@"


