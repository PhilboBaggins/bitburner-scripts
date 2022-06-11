import { STOCK_TO_SERVER } from 'common.js'

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    if (args.help) {
        ns.tprint('This script will "grow" all servers related to stocks for the purpose of increasing all stock prices');
        ns.tprint(`USAGE: run ${ns.getScriptName()}`);
        return;
    }

    ns.disableLog('getServerMaxRam');
    ns.disableLog('getServerUsedRam');

    const childScript = 'stock-grow-continuous-kill.js';

    for (const stock in STOCK_TO_SERVER) {
        ns.tprint(`Launching script ${childScript} for ${stock}`);
        let hostname = STOCK_TO_SERVER[stock];
        ns.exec(childScript, ns.getHostname(), 1, hostname);
    }
}
