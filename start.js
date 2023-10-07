import { printEverywhere, execAndWait, percentRamUsed } from 'common.js'

/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog('sleep');
    ns.disableLog('exec');

    // Helper functions
    async function myExecAndWait(childScript, numThreads, ...childScriptArgs) {
        printEverywhere(ns, `Running ${childScript} ${childScriptArgs}`);
        await execAndWait(ns, childScript, ns.getHostname(), numThreads, ...childScriptArgs);
        await ns.sleep(1 * 1000);
    }
    async function myExec(childScript, numThreads, ...childScriptArgs) {
        printEverywhere(ns, `Running ${childScript} ${childScriptArgs}`);
        ns.exec(childScript, ns.getHostname(), numThreads, ...childScriptArgs);
        await ns.sleep(1 * 1000);
    }

    // Run the wget script twice because it will download itself and that may update the wget script and lead to new downloads on the second run
    // Recently downloaded files seem to be cached and will download quickly, so running the wget script twice shouldn't cause much delay
    //await myExecAndWait('wget-my-scripts.js', 1);
    //await myExecAndWait('wget-my-scripts.js', 1);

    await myExecAndWait('killall-everywhere.js', 1);
    await myExec('stock-grow-continuous-apocalypse-kill.js', 1);

    await myExec('hacknet-auto-purchase.js', 1);

    await myExec('stock-auto-buy.js', 1);
    //await myExec('stock-auto-manipulate.js', 1);
    await myExec('stock-auto-sell.js', 1);

    await myExec('auto-root.js', 1);
    await myExec('deploy-to-all.js', 1, 'hack-self.js');

    // let count = 0;
    // while (percentRamUsed(ns, ns.getHostname()) < 90.0) {
    //     await myExec('hack-cycle.js',     100000, 'a' + count);
    //     await myExec('help-self-hack.js', 100000, 'b' + count);
    //     count++;
    // }

    await myExec('stock-grow-continuous-apocalypse.js', 1);
}
