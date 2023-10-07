import { threadsPossible } from 'common.js'

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    const hostname = args._[0];
    const percentageRAM = parseFloat((args._[1] + '').replace('%', ''));
    if (args.help || !hostname || !percentageRAM) {
        ns.tprint('This script will "grow" a server for the purpose of increasing its company\'s stock price');
        ns.tprint(`USAGE: run ${ns.getScriptName()} SERVER_NAME PERCENTAGE_OF_RAM_TO_USE`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()} n00dles 50`);
        return;
    }

    // Check arguements
    if (percentageRAM > 100.0) {
        ns.tprint(`Percentage or RAM to use (${percentageRAM}) over 100%`);
        return;
    } else if (percentageRAM < 0.0) {
        ns.tprint(`Percentage or RAM to use (${percentageRAM}) less than 0%`);
        return;
    }

    ns.disableLog('getServerMaxRam');
    ns.disableLog('getServerUsedRam');

    const childScript = 'stock-grow.js';
    const desiredIntervalMS = 10 * 1000; // 10 seconds
    const growTime = ns.getGrowTime(hostname);
    const numScripts = Math.ceil(growTime / desiredIntervalMS);
    const numThreads = Math.floor(threadsPossible(ns, childScript,  ns.getHostname()) / 100.0 * percentageRAM);
    const numThreadsPerScript = Math.floor(Math.max(1, numThreads / numScripts));

    ns.tprint(`Launching script ${childScript} against ${hostname} (grow time: ${ns.tFormat(growTime)}) with ${ns.nFormat(numThreads, '0.000a')} threads spread over ${ns.nFormat(numScripts, 'a')} scripts (${ns.nFormat(numThreadsPerScript, 'a')} per script)`);
    for (let i = 0; i < numScripts; i++) {
        ns.exec(childScript, ns.getHostname(), numThreadsPerScript, hostname, i); // The `i` arg will be ignored by `stock-grow.js`, just added so that I can launch multiple `stock-grow.js` scripts
        await ns.sleep(desiredIntervalMS);
    }
}
