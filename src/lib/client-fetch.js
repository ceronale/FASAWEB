import { apiUrl, APIConstans } from '../config/config';

const urlLogin = process.env.REACT_APP_AUTH_URL;

export default async function clientFetch(
	endpoint,
	{ body, ...customConfig } = {},
	{
		_retry = false,
		withFile = false,
	} = { withAuth: true, _retry: false, withFile: false },
) {
	const headers = {};

	if (body && !withFile) {
		headers['content-type'] = 'application/json';
	}

	const config = {
		method: customConfig.method ? customConfig.method : 'POST',
		...customConfig,
		headers: {
			...headers,
			...customConfig.headers,
		},
	};

	if (body && withFile) {
		config.body = body;
	} else if (body) {
		config.body = JSON.stringify(body);
	}

	return window.fetch(`${apiUrl}/${APIConstans.fulfillment}/${endpoint}`, config)
		.then(async (response) => {
			if (response.ok) {
				return response.json();
			}
			const errorMessage = await response.text();
			const grantError = { errorMessage, status: response.status };
			return Promise.reject(grantError);
		})
		.catch(async (error) => {
			const theError = error;
			const expectedError = theError && theError.status === 401;

			if (!expectedError) {
				const errorMessage = error.message;
				return Promise.reject(new Error(errorMessage));
			}

			if (theError.status === 401 && !_retry) {
				_retry = true;

				const newHeaders = new Headers();
				newHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

				const urlencoded = new URLSearchParams();
				urlencoded.append('grant_type', 'refresh_token');
				urlencoded.append('client_id', 'public-cli');

				const requestOptions = {
					method: 'POST',
					headers: newHeaders,
					body: urlencoded,
					redirect: 'follow',
				};
				const _refreshTokenResponse = await window.fetch(urlLogin, requestOptions, {
					withAuth: false,
				});

				if (_refreshTokenResponse.status === 400) {
					window.location.assign('/');
					window.location.reload();
					return Promise.reject(error);
				}
			}
			return Promise.reject(error);
		});
}