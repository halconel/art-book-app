#!/bin/bash

# Feature Test Runner for Art Book App
echo "🧪 Running Feature Tests for User Stories Coverage..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Rails is running
check_rails_server() {
    echo -e "${BLUE}📋 Checking if Rails server is needed...${NC}"
    if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${GREEN}✅ Rails server already running on port 3001${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Rails server not running. Feature tests will start their own server.${NC}"
        return 1
    fi
}

# Set up test environment
setup_test_env() {
    echo -e "${BLUE}🔧 Setting up test environment...${NC}"
    
    # Set test environment
    export RAILS_ENV=test
    export NODE_ENV=test
    
    # Prepare test database
    echo "📊 Preparing test database..."
    bundle exec rails db:test:prepare
    
    # Precompile assets for tests if needed
    if [ ! -d "public/assets" ] || [ -z "$(ls -A public/assets)" ]; then
        echo "🏗️  Precompiling assets for tests..."
        bundle exec rails assets:precompile RAILS_ENV=test
    fi
}

# Run specific test category
run_test_category() {
    local category=$1
    local description=$2
    
    echo -e "${BLUE}🧪 Running ${description}...${NC}"
    echo "----------------------------------------"
    
    bundle exec rspec "spec/features/${category}" \
        --format documentation \
        --color \
        --fail-fast \
        --order defined
        
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✅ ${description} - PASSED${NC}"
    else
        echo -e "${RED}❌ ${description} - FAILED${NC}"
    fi
    
    echo ""
    return $exit_code
}

# Main execution
main() {
    echo -e "${BLUE}🚀 Feature Testing Coverage for ADMIN.md User Stories${NC}"
    echo ""
    
    # Setup
    check_rails_server
    setup_test_env
    
    echo -e "${BLUE}📋 Running User Story Feature Tests...${NC}"
    echo ""
    
    # Track results
    total_categories=0
    passed_categories=0
    
    # Admin User Stories (Scenarios 1-3)
    echo -e "${YELLOW}👨‍💼 ADMIN USER STORIES${NC}"
    echo "========================"
    
    # Scenario 1: Daily Cycle Workflow 
    total_categories=$((total_categories + 1))
    if run_test_category "admin/daily_cycle_workflow_spec.rb" "Scenario 1: Daily Cycle Workflow"; then
        passed_categories=$((passed_categories + 1))
    fi
    
    # Scenario 2: Order Acceptance
    total_categories=$((total_categories + 1))
    if run_test_category "admin/order_acceptance_spec.rb" "Scenario 2: Order Acceptance"; then
        passed_categories=$((passed_categories + 1))
    fi
    
    # Scenario 3: Client Management
    total_categories=$((total_categories + 1))
    if run_test_category "admin/client_management_spec.rb" "Scenario 3: Client Management"; then
        passed_categories=$((passed_categories + 1))
    fi
    
    # Client User Stories (Scenarios 4-6)
    echo -e "${YELLOW}👤 CLIENT USER STORIES${NC}"
    echo "======================"
    
    # Scenario 4: Registration and First Order
    total_categories=$((total_categories + 1))
    if run_test_category "client/registration_and_first_order_spec.rb" "Scenario 4: Registration and First Order"; then
        passed_categories=$((passed_categories + 1))
    fi
    
    # Scenario 5: Order Tracking
    total_categories=$((total_categories + 1))
    if run_test_category "client/order_tracking_spec.rb" "Scenario 5: Order Tracking"; then
        passed_categories=$((passed_categories + 1))
    fi
    
    # Scenario 6: Workload Calendar
    total_categories=$((total_categories + 1))
    if run_test_category "client/workload_calendar_spec.rb" "Scenario 6: Workload Calendar"; then
        passed_categories=$((passed_categories + 1))
    fi
    
    # Final Report
    echo "=================================================="
    echo -e "${BLUE}📊 FEATURE TESTING RESULTS${NC}"
    echo "=================================================="
    echo "Total User Story Scenarios: $total_categories"
    echo "Passed: $passed_categories"
    echo "Failed: $((total_categories - passed_categories))"
    
    coverage_percentage=$(( passed_categories * 100 / total_categories ))
    echo "Coverage: ${coverage_percentage}%"
    echo ""
    
    if [ $passed_categories -eq $total_categories ]; then
        echo -e "${GREEN}🎉 ALL USER STORIES COVERED! Production ready!${NC}"
        echo -e "${GREEN}✅ All 6 key scenarios from ADMIN.md are fully tested${NC}"
        exit 0
    elif [ $coverage_percentage -ge 80 ]; then
        echo -e "${YELLOW}⚠️  Good coverage but some scenarios need attention${NC}"
        echo -e "${YELLOW}📋 Review failed tests before production deployment${NC}"
        exit 1
    else
        echo -e "${RED}❌ Low coverage - critical scenarios failing${NC}"
        echo -e "${RED}🚫 DO NOT DEPLOY until feature tests pass${NC}"
        exit 2
    fi
}

# Run with error handling
set -e
main "$@"