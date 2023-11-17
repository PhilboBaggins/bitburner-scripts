import { printEverywhere, execAndWait, percentRamUsed, myExec, myExecAndWait } from 'common.js'

/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog('sleep');
    ns.disableLog('exec');


    // Run the wget script twice because it will download itself and that may update the wget script and lead to new downloads on the second run
    // Recently downloaded files seem to be cached and will download quickly, so running the wget script twice shouldn't cause much delay
    //await myExecAndWait('wget-my-scripts.js', 1);
    //await myExecAndWait('wget-my-scripts.js', 1);

    await myExecAndWait('killall-everywhere.js', 1);
    await myExecAndWait('stock-grow-continuous-apocalypse-kill.js', 1);

    await myExec('hacknet-auto-purchase.js', 1);

    await myExecAndWait('darkweb-buy.js', 1);

    await myExec('stock-auto-buy.js', 1);
    //await myExec('stock-auto-manipulate.js', 1);
    await myExec('stock-auto-sell.js', 1);

    await myExecAndWait('auto-root.js', 1);
    await myExecAndWait('deploy-to-all.js', 1, 'hack-self.js');

    // let count = 0;
    // while (percentRamUsed(ns, ns.getHostname()) < 90.0) {
    //     await myExec('hack-cycle.js',     100000, 'a' + count);
    //     await myExec('help-self-hack.js', 100000, 'b' + count);
    //     count++;
    // }

//    await myExec('stock-grow-continuous-apocalypse.js', 1);
}
