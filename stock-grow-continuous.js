import { threadsPossible } from 'common.js'

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    const hostname = args._[0];
    if (args.help || !hostname) {
        ns.tprint('This script will "grow" a server for the purpose of increasing its company\'s stock price');
        ns.tprint(`USAGE: run ${ns.getScriptName()} SERVER_NAME`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()} n00dles`);
        return;
    }

    ns.disableLog('getServerMaxRam');
    ns.disableLog('getServerUsedRam');

    const childScript = 'stock-grow.js';
    const desiredIntervalMS = 10 * 1000; // 10 seconds
    const growTime = ns.getGrowTime(hostname);
    const numScripts = Math.floor(growTime / desiredIntervalMS);
    const numThreads = threadsPossible(ns, childScript,  ns.getHostname());
    const numThreadsPerScript = Math.floor(Math.max(1, numThreads / numScripts));
    ns.tprint(`Launching script ${childScript} against ${hostname} (grow time: ${ns.tFormat(growTime)}) with ${ns.nFormat(numThreads, '0.000a')} threads spread over ${ns.nFormat(numScripts, 'a')} scripts (${ns.nFormat(numThreadsPerScript, 'a')} per script)`);
    for (let i = 0; i < numScripts; i++) {
        ns.exec(childScript, ns.getHostname(), numThreadsPerScript, hostname, i); // The `i` arg will be ignored by `stock-grow.js`, just added so that I can launch multiple `stock-grow.js` scripts
        await ns.sleep(desiredIntervalMS);
    }
}
