import { printEverywhere, execAndWait } from 'common.js'

/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog('sleep');
    ns.disableLog('exec');

    // Helper functions
    async function myExecAndWait(childScript, ...childScriptArgs) {
        printEverywhere(ns, `Running ${childScript} ${childScriptArgs}`);
        await execAndWait(ns, childScript, ns.getHostname(), 1, ...childScriptArgs);
        await ns.sleep(1 * 1000);
    }
    async function myExec(childScript, ...childScriptArgs) {
        printEverywhere(ns, `Running ${childScript} ${childScriptArgs}`);
        ns.exec(childScript, ns.getHostname(), 1, ...childScriptArgs);
        await ns.sleep(1 * 1000);
    }

    // Run the wget script twice because it will download itself and that may update the wget script and lead to new downloads on the second run
    // Recently downloaded files seem to be cached and will download quickly, so running the wget script twice shouldn't cause much delay
    await myExecAndWait('wget-my-scripts.js');
    await myExecAndWait('wget-my-scripts.js');

    await myExecAndWait('killall-everywhere.js');

    await myExec('hacknet-auto-purchase.js');

    await myExec('stock-auto-buy.js');
    await myExec('stock-auto-manipulate.js');
    await myExec('stock-auto-sell.js');

    await myExec('auto-root.js');
    await myExec('deploy-to-all.js', 'hack-self.js');
}
