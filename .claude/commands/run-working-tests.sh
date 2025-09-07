#!/bin/bash
# Fast test runner for working feature tests

echo "🧪 Running working feature tests..."
echo "================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Start timer
start_time=$(date +%s)

echo -e "${YELLOW}Running setup verification...${NC}"
bundle exec rspec spec/features/setup_verification_spec.rb --format documentation
setup_result=$?

echo ""
echo -e "${YELLOW}Running minimal feature tests...${NC}"
bundle exec rspec spec/features/minimal_feature_tests_spec.rb --format documentation  
minimal_result=$?

echo ""
echo -e "${YELLOW}Running admin daily cycle workflow (simplified)...${NC}"
bundle exec rspec spec/features/admin/daily_cycle_workflow_spec.rb --format documentation
admin_result=$?

# Calculate runtime
end_time=$(date +%s)
runtime=$((end_time-start_time))

echo ""
echo "================================="
echo -e "${YELLOW}🧪 Test Results Summary${NC}"
echo "================================="

if [ $setup_result -eq 0 ]; then
    echo -e "✅ ${GREEN}Setup verification: PASSED${NC}"
else
    echo -e "❌ ${RED}Setup verification: FAILED${NC}"
fi

if [ $minimal_result -eq 0 ]; then
    echo -e "✅ ${GREEN}Minimal feature tests: PASSED${NC}"
else
    echo -e "❌ ${RED}Minimal feature tests: FAILED${NC}"
fi

if [ $admin_result -eq 0 ]; then
    echo -e "✅ ${GREEN}Admin workflow: PASSED${NC}"
else
    echo -e "❌ ${RED}Admin workflow: FAILED${NC}"
fi

echo ""
echo -e "⏱️  Total runtime: ${runtime}s"
echo ""

# Overall result
if [ $setup_result -eq 0 ] && [ $minimal_result -eq 0 ] && [ $admin_result -eq 0 ]; then
    echo -e "🎉 ${GREEN}ALL TESTS PASSED!${NC}"
    exit 0
else
    echo -e "💥 ${RED}SOME TESTS FAILED${NC}"
    exit 1
fi