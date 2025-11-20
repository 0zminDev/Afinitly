// Script to sync Angular dev server port in project.json with environment.SERVICE_PORT
const fs = require('fs');
const path = require('path');

const workspaceRoot = process.cwd();
const projectKey = 'afinitly-web-user';
const projectDir = path.join(workspaceRoot, 'apps', 'views', 'web', projectKey);
const envFile = path.join(projectDir, 'src', 'environments', 'environment.ts');
const projectJsonPath = path.join(projectDir, 'project.json');

const envContent = fs.readFileSync(envFile, 'utf-8');
let servicePort;
try {
	const objMatch = envContent.match(/export const environment = ({[\s\S]*?});/m);
	if (!objMatch) throw new Error('Could not find environment object');
	const envObj = JSON.parse(objMatch[1]
		.replace(/([A-Za-z0-9_-]+):/g, '"$1":')
		.replace(/'/g, '"')
	);
	servicePort = parseInt(envObj.SERVICE_PORT, 10);
	if (isNaN(servicePort)) throw new Error('SERVICE_PORT not found or not a number');
} catch {
	process.exit(1);
}

const projectJson = JSON.parse(fs.readFileSync(projectJsonPath, 'utf-8'));

let updated = false;
if (projectJson.targets && projectJson.targets.serve && projectJson.targets.serve.options) {
	projectJson.targets.serve.options.port = servicePort;
	updated = true;
}
if (projectJson.targets && projectJson.targets['serve-static'] && projectJson.targets['serve-static'].options) {
	projectJson.targets['serve-static'].options.port = servicePort;
	updated = true;
}
if (updated) {
	fs.writeFileSync(projectJsonPath, JSON.stringify(projectJson, null, '\t'));
} else {
	process.exit(1);
}
