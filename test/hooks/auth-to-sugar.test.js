const assert = require('assert');
const authToSugar = require('../../src/hooks/authenticate-to-sugar');

describe('\'authenticateToSugar\' hook', () => {
	it('runs the hook', () => {
		// A mock hook object
		const mock = {};
		// Initialize our hook with no options
		const hook = authToSugar();

		// Run the hook function (which returns a promise)
		// and compare the resulting hook object
		return hook(mock).then(result => {
			assert.equal(result, mock, 'Returns the expected hook object');
		});
	});
});
