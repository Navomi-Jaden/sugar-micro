const axios = require('axios');

const {
	NotAuthenticated,
	BadRequest
} = require('feathers-errors');
const {
	info
} = require('winston');

module.exports = function(options = {}) { // eslint-disable-line no-unused-vars
	return function authToSugar(hook) {
		let app = hook.app;

		return new Promise(function(resolve, reject) {
			if (hook.data) {
				let strategy = hook.data.strategy || '';
				let url = hook.data.url || '';
				
				let username = hook.data.username || '';
				let password = hook.data.password || '';
				let client_id = hook.data.client_id || '';
				let client_secret = hook.data.client_secret || '';
				
				if (strategy === 'local') {
					if (url === '')
						return reject(new BadRequest('`url` must be defined.'));

					if (hook.path === 'authentication') {
						return axios.post(`${url}/rest/v10/oauth2/token`, {
							grant_type: 'password',
							client_id,
							client_secret,
							username,
							password,
							platform: 'base'
						}).then(res => {
							if (res.data.access_token) {
								hook.result = app.passport.createJWT({
									url,
									client_id,
									client_secret,
									access_token: res.data.access_token,
									refresh_token: res.data.refresh_token,
									refresh_exp: res.data.refresh_expires_in,
								}, app.passport.options('jwt'));

								return resolve(hook);
							}
							
							return reject(new NotAuthenticated(res.data));
						}).catch(err => {
							return reject(err.data);
						});
					}

					return reject('Local is only available on the /authentication path');
				} else if (strategy === 'jwt' || (strategy === '' && hook.params.headers.authorization)) {
					let token = (hook.params.headers.authorization || hook.data.access_token || '').replace(/Bearer\s/, '');

					if (token !== '') {
						return app.passport.verifyJWT(token, app.passport.options('jwt')).then(async jwt => {
							const valid_session = await axios.get(`${jwt.url}/rest/v10/ping`, {
								headers: {
									'oauth-token': jwt.access_token
								}
							}).then(res => {
								return true;
							}).catch(err => {
								return axios.post(`${jwt.url}/rest/v10/oauth2/token`, {
									grant_type: 'refresh_token',
									refresh_token: jwt.refresh_token,
									client_id: jwt.client_id,
									client_secret: jwt.client_secret,
								}).then(res => {
									jwt.access_token = res.data.access_token;
									jwt.refresh_token = res.data.refresh_token;
									jwt.refresh_exp = res.data.refresh_expires_in;

									return true;
								}).catch(err => {
									return reject(new NotAuthenticated(err.response.data));
								});
							});

							if (valid_session) {
								if (hook.path === 'authentication')
									hook.result = jwt;
								else
									hook.params.jwt = jwt;

								return resolve(hook);
							}
						}).catch(err => {
							return reject(new NotAuthenticated(err.response.data));
						});
					}

					return reject(new BadRequest('You must provide a JWT access token in ethier the body or in the headers (as bearer).'));
				}

				return reject(new BadRequest('Strategy must either be `local` or `jwt`.'));
			}
			
			return reject(new BadRequest('Request cannot be empty.'));
		});
	};
};
