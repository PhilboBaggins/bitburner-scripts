import { printEverywhere, execAndWait } from './common.js'

/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog('sleep');
    ns.disableLog('exec');

    // Helper function to call execAndWait with common args filled in
    async function myExecAndWait(childScript, ...childScriptArgs) {
        printEverywhere(ns, `Running ${childScript} ${childScriptArgs}`);
        await execAndWait(ns, childScript, ns.getHostname(), 1, ...childScriptArgs);
    }

    // Run the wget script twice because it will download itself and that may update the wget script and lead to new downloads on the second run
    // Recently downloaded files seem to be cached and will download quickly, so running the wget script twice shouldn't cause much delay
    await myExecAndWait('wget-my-scripts.js');
    await myExecAndWait('wget-my-scripts.js');

    await myExecAndWait('killall-everywhere.js');

    await myExecAndWait('hacknet-auto-purchase.js');

    await myExecAndWait('auto-root.js');
    await myExecAndWait('deploy-to-all.js', 'hack-self.js');
    
    await myExecAndWait('stock-auto-buy.js');
    await myExecAndWait('stock-auto-manipulate.js');
    await myExecAndWait('stock-auto-sell.js');
}
