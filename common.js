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
