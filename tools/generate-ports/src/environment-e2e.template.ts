import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { join } from 'path';

const setupEnvironment = () => {
	const projectDir = join(process.cwd(), '__PROJECT_DIR__');
	const mainEnv = dotenv.config({ path: join(projectDir, '.env') });
	dotenvExpand.expand(mainEnv);
	const environmentValue = process.env.ENVIRONMENT;
	if (!environmentValue) {
		// eslint-disable-next-line no-console
		console.log('ENVIRONMENT is not set in environment variables!');
		process.exit(1);
	}
	const envConfig = dotenv.config({ path: join(projectDir, `.${environmentValue}.env`) });
	dotenvExpand.expand(envConfig);
}

export default setupEnvironment;
