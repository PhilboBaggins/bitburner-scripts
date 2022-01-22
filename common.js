export function printEverywhere(ns, ...msg) {
    ns.print(...msg);
    ns.tprint(...msg);
}

export async function execAndWait(ns, childScript, host, numThreads, ...childScriptArgs) {
    const pid = ns.exec(childScript, host, numThreads, ...childScriptArgs);

    while (ns.isRunning(pid, host)) {
        await ns.sleep(1 * 1000); // Wait 1 second
    }
}

export async function scanAndRun(ns, parent, server, asyncFunc) {
	const children = ns.scan(server);
	for (let child of children) {
		if (parent == child) {
			continue;
		}
		await asyncFunc(child);
		await scanAndRun(ns, server, child, asyncFunc);
	}
}

export function numberFormat(ns, num) {
    return ns.nFormat(num, '0.000a').padStart(8);
}

export function percentageToDecimal(percentage) {
    return percentage / 100.0;
}
