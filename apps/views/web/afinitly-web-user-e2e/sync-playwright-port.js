// This script syncs Playwright config with Angular dev server port from .env
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '.env');
const playwrightConfigPath = path.resolve(__dirname, 'playwright.config.ts');

if (!fs.existsSync(envPath)) {
	console.error('.env file not found:', envPath);
	process.exit(1);
}

const env = dotenv.config({ path: envPath }).parsed || {};
const serviceHost = env.SERVICE_HOST || 'localhost';
const servicePort = env.SERVICE_PORT || '4100';
const baseURL = `http://${serviceHost}:${servicePort}`;

let config = fs.readFileSync(playwrightConfigPath, 'utf8');

// Replace baseURL and webServer.url assignments
config = config.replace(
	/const baseURL = .*?;/,
	`const baseURL = '${baseURL}';`
);
config = config.replace(
	/url: baseURL,/,
	`url: '${baseURL}',`
);

fs.writeFileSync(playwrightConfigPath, config);
console.log('playwright.config.ts updated with baseURL:', baseURL);
