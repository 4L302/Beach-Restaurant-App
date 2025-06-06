// server/tests/runTests.js
console.log("Starting tests...\n");

// Require test files
// Make sure to handle potential errors during require itself, though unlikely for simple test files.
try {
    require('./dbHelpers.test.js');
    // Add other test files here:
    // require('./anotherModule.test.js');
} catch (error) {
    console.error("Error loading test files:", error);
    process.exitCode = 1; // Indicate failure
}

// A more robust runner would count passes/failures from individual tests.
// For this basic setup, we rely on individual tests logging errors and potentially setting process.exitCode.
// If all required test files execute without throwing unhandled exceptions during their top-level execution,
// and without individual tests setting process.exitCode to 1, this script will exit with 0.

// Check if any test set process.exitCode to 1 (e.g. if an assertion failed and was caught by 'it')
if (process.exitCode === 1) {
    console.log("\nSome tests failed.");
} else {
    console.log("\nAll tests completed (check output for individual test status).");
}
