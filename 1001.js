//
// Do some nonsense, get some "achievements":
//
// * Need more real life ram - Run 1000 scripts simultaneously.
// * Thank you folders! - Have 30 scripts on your home computer.
//

const SLEEP_SCRIPT = `
/** @param {NS} ns **/
export async function main(ns) {
	await ns.sleep(60 * 1000);
}
`;

function genFileName(ns, i) {
	return 'sleeper-' + ns.nFormat(i, '0000') + '.js';
}

/** @param {NS} ns **/
export async function main(ns) {
	let numScripts = 1001;

	// Create 1001 scripts and run them
	for (let i = 1; i <= numScripts; i++) {
		let fileName = genFileName(ns, i);
		await ns.write(fileName, SLEEP_SCRIPT, 'w');
		ns.exec(fileName, 'home');
	}

	await ns.sleep(10 * 1000); // Wait 10 seconds

	for (let i = 1; i <= numScripts; i++) {
		let fileName = genFileName(ns, i);
		ns.kill(fileName, 'home');
		ns.rm(fileName);
	}
}
