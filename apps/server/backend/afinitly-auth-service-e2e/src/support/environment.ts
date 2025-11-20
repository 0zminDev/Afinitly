import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { join } from 'path';
import { Logger } from "@nestjs/common";

const setupEnvironment = () => {
	const projectDir = join(process.cwd(), 'apps/server/backend/afinitly-auth-service-e2e/.');
	const mainEnv = dotenv.config({ path: join(projectDir, '.env') });
	dotenvExpand.expand(mainEnv);
	const environmentValue = process.env.ENVIRONMENT;
	if (!environmentValue) {
		Logger.error('ENVIRONMENT is not set in environment variables!');
		process.exit(1);
	}
	const envConfig = dotenv.config({ path: join(projectDir, `${environmentValue}.env`) });
	dotenvExpand.expand(envConfig);
}

export default setupEnvironment;
