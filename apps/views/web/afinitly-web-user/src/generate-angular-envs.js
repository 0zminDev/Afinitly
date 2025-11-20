const fs = require('fs');
const path = require('path');

const workspaceRoot = process.cwd();
const projectKey = 'afinitly-web-user';
const projectDir = path.join(workspaceRoot, 'apps', 'views', 'web', projectKey);
const envDir = path.join(projectDir, 'src', 'environments');
if (!fs.existsSync(envDir)) fs.mkdirSync(envDir, { recursive: true });

const mainEnv = fs.readFileSync(path.join(projectDir, '.env'), 'utf-8');
const envVars = {};

mainEnv.split('\n').forEach(line => {
	if (line.trim().startsWith('##')) return;
	const [key, value] = line.split('=');
	if (key) envVars[key.trim()] = value ? value.trim() : '';
});

const envFiles = fs.readdirSync(projectDir).filter(f => f.match(/^\.(\w+)\.env$/));
for (const file of envFiles) {
	const envName = file.match(/^\.(\w+)\.env$/)[1];
	const envContent = fs.readFileSync(path.join(projectDir, file), 'utf-8');
	const envObj = { ...envVars };

	envContent.split('\n').forEach(line => {
		   if (line.trim().startsWith('##')) return;
		   const [key, value] = line.split('=');
		   if (key) envObj[key.trim()] = value ? value.trim() : '';
	});

	const isProd = envName === 'production';
	const outFile = path.join(envDir, isProd ? 'environment.prod.ts' : 'environment.ts');
	fs.writeFileSync(outFile, `export const environment = ${JSON.stringify(envObj, null, '\t')};\n`);
}
