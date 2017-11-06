const axios = require('axios');

const { NotAuthenticated, BadRequest, NotFound } = require('feathers-errors');

/* eslint-disable no-unused-vars */
class Service {
	constructor (options) {
		this.options = options || {};
	}

	find (params) {
		return new Promise(function(resolve, reject) {
			const query = params.query || '';
			
			const jwt = params.jwt || '';
			
			if (jwt !== '') {
				let url = jwt.url || '';
				let access_token = jwt.access_token || '';
				
				if (query !== '' && query.filter) {
					let filter = JSON.parse(query.filter);
					
					return axios.post(`${url}/rest/v10/Accounts/filter`, { filter }, {
						headers: { 'oauth-token': jwt.access_token }
					}).then(res => {
						if (res.data && res.data.records)
							return resolve(res.data);
							
						return reject(new NotFound('Nothing was found in accounts'));
					}).catch(err => {
						if (err.response.status === 400 || err.response.status === 401)
							return reject(new NotAuthenticated(err.response.data));
							
						return reject(err.response);
					});
				} else {
					return axios.get(`${url}/rest/v10/Accounts`, {
						headers: { 'oauth-token': access_token }
					}).then(res => {
						if (res.data && res.data.records)
							return resolve(res.data.records);
							
						return reject(new NotFound('Nothing was found in accounts'));
					}).catch(err => {
						if (err.response.status === 400 || err.response.status === 401)
							return reject(new NotAuthenticated(err.response.data));
							
						return reject(err.response);
					});
				}
			}
			
			return reject(new NotAuthenticated('User must be logged in to list records.'));
		});
	}

	get (id, params) {
		return new Promise(function(resolve, reject) {
			const jwt = params.jwt || '';
			
			if (jwt !== '') {
				let url = jwt.url || '';
				
				return axios.get(`${url}/rest/v10/Accounts/${id}`, {
					headers: { 'oauth-token': jwt.access_token }
				}).then(res => {
					if (res.data)
						return resolve(res.data);
					
					return reject(new NotFound('Nothing was found in accounts with that id.'));
				}).catch(err => {
					if (err.response.status === 400 || err.response.status === 401)
						return reject(new NotAuthenticated(err.response.data));
						
					return reject(err.response);
				});
			}
			
			return reject(new NotAuthenticated('User must be logged in to list records.'));
		});
	}

	create (data, params) {
		return new Promise(function(resolve, reject) {
			const jwt = params.jwt || '';
			
			if (jwt !== '') {
				let url = jwt.url || '';
				
				return axios.post(`${url}/rest/v10/Accounts`, data, {
					headers: { 'oauth-token': jwt.access_token }
				}).then(res => {
					return resolve(res.data);
				}).catch(err => {
					if (err.response.status === 400 || err.response.status === 401)
						return reject(new NotAuthenticated(err.response.data));
						
					return reject(err.response);
				});
			}
			
			return reject(new NotAuthenticated('User must be logged in to create records.'));
		});
	}

	update (id, data, params) {
		return new Promise(function(resolve, reject) {
			const jwt = params.jwt || '';
			
			if (jwt !== '') {
				let url = jwt.url || '';
				
				return axios.put(`${url}/rest/v10/Accounts/${id}`, data, {
					headers: { 'oauth-token': jwt.access_token }
				}).then(res => {
					return resolve(res.data);
				}).catch(err => {
					if (err.response.status === 400 || err.response.status === 401)
						return reject(new NotAuthenticated(err.response.data));
						
					return reject(err.response);
				});
			}
			
			return reject(new NotAuthenticated('User must be logged in to create records.'));
		});
	}

	patch (id, data, params) {
		return this.update(id, data, params);
	}

	remove (id, params) {
		return new Promise(function(resolve, reject) {
			const jwt = params.jwt || '';
			
			if (jwt !== '') {
				let url = jwt.url || '';
				
				return axios.delete(`${url}/rest/v10/Accounts/${id}`, {
					headers: { 'oauth-token': jwt.access_token }
				}).then(res => {
					return resolve(res.data);
				}).catch(err => {
					if (err.response.status === 400 || err.response.status === 401)
						return reject(new NotAuthenticated(err.response.data));
						
					return reject(err.response);
				});
			}
			
			return reject(new NotAuthenticated('User must be logged in to create records.'));
		});
	}
}

module.exports = function (options) {
	return new Service(options);
};

module.exports.Service = Service;
