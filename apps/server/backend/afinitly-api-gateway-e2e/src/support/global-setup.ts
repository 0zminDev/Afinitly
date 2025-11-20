import { waitForPortOpen } from "@nx/node/utils";
import setupEnvironment from "./environment";

/* eslint-disable */
var __TEARDOWN_MESSAGE__: string;

module.exports = async function () {
	// Start services that that the app needs to run (e.g. database, docker-compose, etc.).
	console.log("\nSetting up...\n");

	setupEnvironment();

	const host = process.env.SERVICE_HOST;
	const port = process.env.SERVICE_PORT;

	if(!host) {
		console.error('SERVICE_HOST is not set in environment variables!');
		process.exit(1);
	}
	if (!port) {
		console.error('SERVICE_PORT is not set in environment variables!');
		process.exit(1);
	}

	await waitForPortOpen(Number(port), { host });

	// Hint: Use `globalThis` to pass variables to global teardown.
	globalThis.__TEARDOWN_MESSAGE__ = "\nTearing down...\n";
};
