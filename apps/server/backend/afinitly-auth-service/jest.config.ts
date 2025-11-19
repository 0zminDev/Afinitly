export default {
	displayName: "afinitly-auth-service",
	preset: "../../../../jest.preset.js",
	testEnvironment: "node",
	transform: {
		"^.+\\.[tj]s$": [
			"ts-jest",
			{ tsconfig: "<rootDir>/tsconfig.spec.json" },
		],
	},
	moduleFileExtensions: ["ts", "js", "html"],
	coverageDirectory:
		"../../../../coverage/apps/server/backend/afinitly-auth-service",
};
