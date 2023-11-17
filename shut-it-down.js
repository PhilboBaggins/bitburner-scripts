import { printEverywhere, execAndWait, percentRamUsed, myExec, myExecAndWait } from 'common.js'

/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog('sleep');
    ns.disableLog('exec');

    await myExecAndWait('killall-everywhere.js', 1);
    await myExecAndWait('stock-sell-all.js', 1);

    // TODO: Spend money .... gang equipment, faction donations, etc
}
