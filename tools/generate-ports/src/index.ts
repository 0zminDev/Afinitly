import { generatePorts } from "./lib/generate-ports";

import { purgePorts } from "./lib/generate-ports";

if (process.argv.includes('purge')) {
	purgePorts();
} else {
	generatePorts();
}
