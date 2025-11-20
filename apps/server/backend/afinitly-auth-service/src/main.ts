import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import setupEnvironment from "./environment";

setupEnvironment();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const port = process.env.SERVICE_PORT;
	const host = process.env.SERVICE_HOST;
	const name = process.env.SERVICE_NAME || "Unknown Service";

	if(!host) {
		Logger.error('SERVICE_HOST is not set in environment variables!');
		process.exit(1);
	}
	if (!port) {
		Logger.error('SERVICE_PORT is not set in environment variables!');
		process.exit(1);
	}

	const globalPrefix = "api";
	app.setGlobalPrefix(globalPrefix);

	await app.listen(port, host);

	Logger.log(
		`🚀 Application: ${name}; is running on: http://${host}:${port}/${globalPrefix}`
	);
}

bootstrap();
