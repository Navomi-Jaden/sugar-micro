const users = require('./users/users.service');

const accounts = require('./accounts/accounts.service.js');

module.exports = function() {
	const app = this; // eslint-disable-line no-unused-vars
	app.configure(users);
	app.configure(accounts);
};
