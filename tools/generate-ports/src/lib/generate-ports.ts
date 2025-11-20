export function purgePorts(): void {
	const fs = require('fs');
	const path = require('path');
	const workspaceRoot = process.cwd();
	const portsConf = JSON.parse(fs.readFileSync(path.join(workspaceRoot, 'ports.conf.json'), 'utf-8'));
	const envConf = JSON.parse(fs.readFileSync(path.join(workspaceRoot, 'env.conf.json'), 'utf-8'));
	const envs = envConf['environments'] || ['development', 'staging', 'production'];

	for (const envServices of Object.values(portsConf)) {
		for (const serviceKey of Object.keys(envServices)) {
			let serviceDir;

			if (serviceKey.startsWith('afinitly-web')) {
				serviceDir = path.join(workspaceRoot, 'apps', 'views', 'web', serviceKey);
			} else if (serviceKey.startsWith('afinitly-mobile')) {
				serviceDir = path.join(workspaceRoot, 'apps', 'views', 'mobile', serviceKey);
			} else if (serviceKey.startsWith('afinitly-desktop')) {
				serviceDir = path.join(workspaceRoot, 'apps', 'views', 'desktop', serviceKey);
			} else if (serviceKey.startsWith('afinitly-service')) {
				serviceDir = path.join(workspaceRoot, 'apps', 'services', serviceKey);
			} else {
				serviceDir = path.join(workspaceRoot, 'apps', 'server', 'backend', serviceKey);
			}

			try {
				fs.unlinkSync(path.join(serviceDir, '.env'));
			} catch {
				//
			}
			for (const envName of envs) {
				try {
					fs.unlinkSync(path.join(serviceDir, `.${envName}.env`));
				} catch {
					//
				}
			}

			let e2eDir;
			if (serviceKey.startsWith('afinitly-web')) {
				e2eDir = path.join(workspaceRoot, 'apps', 'views', 'web', `${serviceKey}-e2e`);
			} else if (serviceKey.startsWith('afinitly-mobile')) {
				e2eDir = path.join(workspaceRoot, 'apps', 'views', 'mobile', `${serviceKey}-e2e`);
			} else if (serviceKey.startsWith('afinitly-desktop')) {
				e2eDir = path.join(workspaceRoot, 'apps', 'views', 'desktop', `${serviceKey}-e2e`);
			} else if (serviceKey.startsWith('afinitly-service')) {
				e2eDir = path.join(workspaceRoot, 'apps', 'services', `${serviceKey}-e2e`);
			} else {
				e2eDir = path.join(workspaceRoot, 'apps', 'server', 'backend', `${serviceKey}-e2e`);
			}
			try {
				fs.unlinkSync(path.join(e2eDir, '.env'));
			} catch {
				//
			}
			for (const envName of envs) {
				try {
					fs.unlinkSync(path.join(e2eDir, `.${envName}.env`));
				} catch {
					//
				}
			}
		}
	}
}

export function generatePorts(): void {
	const fs = require('fs');
	const path = require('path');
	const workspaceRoot = process.cwd();
	const conf = JSON.parse(fs.readFileSync(path.join(workspaceRoot, 'ports.conf.json'), 'utf-8'));

	const envConf = JSON.parse(fs.readFileSync(path.join(workspaceRoot, 'env.conf.json'), 'utf-8'));
	const currentEnv = envConf['current-environment'];
	const secrets = envConf['secrets'] || [];

	for (const [envName, envServices] of Object.entries(conf)) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const gateway = Object.values(envServices).find((s: any) => s.key === 'gateway');

		for (const [serviceKey, service] of Object.entries(envServices)) {
			let serviceDir;
			if (serviceKey.startsWith('afinitly-web')) {
				serviceDir = path.join(workspaceRoot, 'apps', 'views', 'web', serviceKey);
			} else if (serviceKey.startsWith('afinitly-mobile')) {
				serviceDir = path.join(workspaceRoot, 'apps', 'views', 'mobile', serviceKey);
			} else if (serviceKey.startsWith('afinitly-desktop')) {
				serviceDir = path.join(workspaceRoot, 'apps', 'views', 'desktop', serviceKey);
			} else if (serviceKey.startsWith('afinitly-service')) {
				serviceDir = path.join(workspaceRoot, 'apps', 'services', serviceKey);
			} else {
				serviceDir = path.join(workspaceRoot, 'apps', 'server', 'backend', serviceKey);
			}
			if (!fs.existsSync(serviceDir)) fs.mkdirSync(serviceDir, { recursive: true });

			fs.writeFileSync(path.join(serviceDir, '.env'), `ENVIRONMENT=${currentEnv}\n`);

			let output = '';

			if (gateway && service !== gateway) {
				output += `## APIGATEWAY\n`;
				output += `GATEWAY_PORT=${gateway.port}\nGATEWAY_HOST=${gateway.host}\nGATEWAY_NAME=${gateway.name}\n\n`;
			}
			output += `## ${service.name.toUpperCase()}\n`;
			output += `SERVICE_PORT=${service.port}\nSERVICE_HOST=${service.host}\nSERVICE_NAME=${service.name}\n\n`;

			for (const [resourceKey, resource] of Object.entries(service) as [string, { port: number, host: string, name: string }][]) {
				if (['port', 'host', 'name', 'key'].includes(resourceKey)) continue;
				output += `${resourceKey.toUpperCase()}_PORT=${resource.port}\n`;
				output += `${resourceKey.toUpperCase()}_HOST=${resource.host}\n`;
				output += `${resourceKey.toUpperCase()}_NAME=${resource.name}\n\n`;
			}

			if (secrets.length > 0) {
				output += '## SECRETS\n';
				for (const secret of secrets) {
					output += `${secret.toUpperCase()}=\n`;
				}
			}

			const envFileName = `.${envName}.env`;
			fs.writeFileSync(path.join(serviceDir, envFileName), output);

			if (serviceDir.includes('server\\backend')) {
				const envTemplatePath = path.join(workspaceRoot, 'tools', 'generate-ports', 'src', 'environment.template.ts');
				const envTsPath = path.join(serviceDir, 'src', 'environment.ts');
				if (!fs.existsSync(path.join(serviceDir, 'src'))) fs.mkdirSync(path.join(serviceDir, 'src'), { recursive: true });
				let envTsContent = fs.readFileSync(envTemplatePath, 'utf-8');
				let relProjectDir = serviceDir.replace(workspaceRoot + path.sep, '') + '/.';
				relProjectDir = relProjectDir.replace(/\\/g, '/');
				envTsContent = envTsContent.replace(/__PROJECT_DIR__/g, relProjectDir);
				fs.writeFileSync(envTsPath, envTsContent);
			}

			let e2eDir;
			if (serviceKey.startsWith('afinitly-web')) {
				e2eDir = path.join(workspaceRoot, 'apps', 'views', 'web', `${serviceKey}-e2e`);
			} else if (serviceKey.startsWith('afinitly-mobile')) {
				e2eDir = path.join(workspaceRoot, 'apps', 'views', 'mobile', `${serviceKey}-e2e`);
			} else if (serviceKey.startsWith('afinitly-desktop')) {
				e2eDir = path.join(workspaceRoot, 'apps', 'views', 'desktop', `${serviceKey}-e2e`);
			} else if (serviceKey.startsWith('afinitly-service')) {
				e2eDir = path.join(workspaceRoot, 'apps', 'services', `${serviceKey}-e2e`);
			} else {
				e2eDir = path.join(workspaceRoot, 'apps', 'server', 'backend', `${serviceKey}-e2e`);
			}
			if (!fs.existsSync(e2eDir)) fs.mkdirSync(e2eDir, { recursive: true });

			const e2eEnvFileName = `.${envName}.env`;
			const e2eEnv = `SERVICE_PORT=${service.port}\nSERVICE_HOST=${service.host}\nSERVICE_NAME=${service.name}\n`;
			fs.writeFileSync(path.join(e2eDir, e2eEnvFileName), e2eEnv);
			fs.writeFileSync(path.join(e2eDir, '.env'), `ENVIRONMENT=${currentEnv}\n`);

			if (e2eDir.includes('server\\backend')) {
				const supportDir = path.join(e2eDir, 'src', 'support');
				if (fs.existsSync(supportDir)) {
					const envTemplatePath = path.join(workspaceRoot, 'tools', 'generate-ports', 'src', 'environment.template.ts');
					const envTsPath = path.join(supportDir, 'environment.ts');
					let envTsContent = fs.readFileSync(envTemplatePath, 'utf-8');
					let relProjectDir = e2eDir.replace(workspaceRoot + path.sep, '') + '/.';
					relProjectDir = relProjectDir.replace(/\\/g, '/');
					envTsContent = envTsContent.replace(/__PROJECT_DIR__/g, relProjectDir);
					fs.writeFileSync(envTsPath, envTsContent);
				}
			}
		}
	}
}
