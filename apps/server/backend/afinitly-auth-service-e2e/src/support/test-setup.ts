/* eslint-disable */
import axios from "axios";

module.exports = async function () {
	// Configure axios for tests to use.
	const host = process.env.SERVICE_HOST;
	const port = process.env.SERVICE_PORT;

	if(!host) {
		console.error('TESET-SETUP SERVICE_HOST is not set in environment variables!');
		process.exit(1);
	}
	if (!port) {
		console.error('TESET-SETUP SERVICE_PORT is not set in environment variables!');
		process.exit(1);
	}

	axios.defaults.baseURL = `http://${host}:${port}`;
};
