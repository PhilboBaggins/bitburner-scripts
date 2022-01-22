import { scanAndRun } from './common.js'

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    if (args.help) {
        ns.tprint('Kill all scripts on all servers.');
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    var serverKillCount = 0;
    await scanAndRun(ns, async function(host) {
        let somethingWasKilled = ns.killall(host);
        if (somethingWasKilled)
            serverKillCount++;
    });

    if (serverKillCount == 0) {
        ns.tprint('Nothing to kill.');
    } else {
        ns.tprint(`Scripts killed on ${serverKillCount} servers`);
    }
}
