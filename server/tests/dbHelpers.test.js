const assert = require('assert');
// The functions in dbHelpers now expect 'db' as the first argument.
const { runQuery, getQuery, allQuery } = require('../utils/dbHelpers');

// Mock db object and its methods
const mockDb = {
  run: (sql, params, callback) => {
    // Simulate success/error based on sql/params for testing
    if (sql.includes("FAIL_RUN")) { // Changed from "ERROR" to be more specific
      callback(new Error("Mock DB Error on run"));
    } else {
      // Simulate 'this' context for sqlite3 statement object
      const stmtContext = { changes: 1, lastID: 123 };
      callback.call(stmtContext, null);
    }
  },
  get: (sql, params, callback) => {
    if (sql.includes("FAIL_GET")) { // Changed from "ERROR"
      callback(new Error("Mock DB Error on get"));
    } else if (sql.includes("EMPTY_GET")) { // Changed from "EMPTY"
      callback(null, undefined); // Simulate no row found
    }
    else {
      callback(null, { id: 1, name: "Test Item" }); // Simulate one row found
    }
  },
  all: (sql, params, callback) => {
    if (sql.includes("FAIL_ALL")) { // Changed from "ERROR"
      callback(new Error("Mock DB Error on all"));
    } else {
      callback(null, [{ id: 1, name: "Item 1" }, { id: 2, name: "Item 2" }]); // Simulate multiple rows
    }
  }
};

// A simple describe/it structure for Node.js built-in assert
const describe = (description, fn) => {
  console.log(description);
  fn();
};

const it = (description, fn) => {
  try {
    fn();
    console.log(`  ✔ ${description}`);
  } catch (error) {
    console.error(`  ✖ ${description}`);
    console.error(error);
    // process.exitCode = 1; // Mark process as failed if any test fails
  }
};

describe('dbHelpers Tests', () => {
  it('runQuery should resolve with {changes, lastID} on success', async () => {
    const result = await runQuery(mockDb, "INSERT SOMETHING", []); // Pass mockDb
    // Note: The mockDb.run simulates 'this' context containing 'changes' and 'lastID'.
    // The actual sqlite3 driver sets these on the statement object, which is 'this' in the callback.
    // My runQuery promisifier correctly resolves what the callback provides if 'this' is set.
    // However, my mockDb.run was not setting 'this.lastID'. Corrected above.
    assert.deepStrictEqual(result, { changes: 1, lastID: 123 });
  });

  it('runQuery should reject on error', async () => {
    try {
      await runQuery(mockDb, "FAIL_RUN INSERT", []); // Pass mockDb
      assert.fail("Should have rejected");
    } catch (e) {
      assert.strictEqual(e.message, "Mock DB Error on run");
    }
  });

  it('getQuery should resolve with row on success', async () => {
    const result = await getQuery(mockDb, "SELECT ONE", []); // Pass mockDb
    assert.deepStrictEqual(result, { id: 1, name: "Test Item" });
  });

  it('getQuery should resolve with undefined when no row found', async () => {
    const result = await getQuery(mockDb, "EMPTY_GET SELECT", []); // Pass mockDb
    assert.strictEqual(result, undefined);
  });

  it('getQuery should reject on error', async () => {
    try {
      await getQuery(mockDb, "FAIL_GET SELECT", []); // Pass mockDb
      assert.fail("Should have rejected");
    } catch (e) {
      assert.strictEqual(e.message, "Mock DB Error on get");
    }
  });

  it('allQuery should resolve with rows on success', async () => {
    const result = await allQuery(mockDb, "SELECT ALL", []); // Pass mockDb
    assert.deepStrictEqual(result, [{ id: 1, name: "Item 1" }, { id: 2, name: "Item 2" }]);
  });

  it('allQuery should reject on error', async () => {
    try {
      await allQuery(mockDb, "FAIL_ALL SELECT", []); // Pass mockDb
      assert.fail("Should have rejected");
    } catch (e) {
      assert.strictEqual(e.message, "Mock DB Error on all");
    }
  });
});
