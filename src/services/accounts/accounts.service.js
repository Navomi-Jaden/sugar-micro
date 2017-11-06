// Initializes the `Accounts` service on path `/accounts`
const createService = require('./accounts.class.js');
const hooks = require('./accounts.hooks');
const filters = require('./accounts.filters');

module.exports = function () {
	const app = this;
	const paginate = app.get('paginate');

	const options = {
		name: 'accounts',
		paginate
	};

	// Initialize our service with any options it requires
	app.use('/accounts', createService(options));

	// Get our initialized service so that we can register hooks and filters
	const service = app.service('accounts');

	service.hooks(hooks);

	if (service.filter) {
		service.filter(filters);
	}
};
