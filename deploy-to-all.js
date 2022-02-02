import { scanAndRun } from 'common.js'

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    if (args.help || args._.length < 1) {
        ns.tprint('This script deploys another script to all servers and runs it with maximum threads possible.');
        ns.tprint(`Usage: run ${ns.getScriptName()} script [arguments]`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()} hack-self.js`);
        return;
    }

    // TODO: Don't run on my own servers
    //const boughtServers = ns.getPurchasedServers(ns);

    const script = args._[0];
    const scriptArgs = args._.slice(1);

    if (ns.ls(ns.getHostname()).find(f => f === script) == false) {
        ns.tprint(`Script '${script}' does not exist. Aborting.`);
        return;
    }

    await scanAndRun(ns, async function(host) {
        const threads = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam(script));
        if (scriptArgs.length > 0) {
            ns.tprint(`Launching script '${script}' on server '${host}' with ${threads} threads and the following arguments: ${scriptArgs}`);
        } else {
            ns.tprint(`Launching script '${script}' on server '${host}' with ${threads} threads`);
        }
        if (threads > 0) {
            await ns.scp(script, ns.getHostname(), host);
            ns.exec(script, host, threads, ...scriptArgs);
        }
        else {
            // ???????????????????????????
        }
    });
}
