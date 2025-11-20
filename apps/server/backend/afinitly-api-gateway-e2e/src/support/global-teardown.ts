import { killPort } from "@nx/node/utils";
/* eslint-disable */

module.exports = async function () {
	// Put clean up logic here (e.g. stopping services, docker-compose, etc.).
	// Hint: `globalThis` is shared between setup and teardown.
	const port = process.env.SERVICE_PORT;

	if (!port) {
		console.error('SERVICE_PORT is not set in environment variables!');
		process.exit(1);
	}

	await killPort(Number(port));
	console.log(globalThis.__TEARDOWN_MESSAGE__);
};
