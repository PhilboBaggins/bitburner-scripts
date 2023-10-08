import { findPath } from 'common.js'

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    const target = args._[0];
    if (args.help || !target) {
        ns.tprint('Print out a commands that can be executed to connect to the specified server');
        ns.tprint(`Usage: run ${ns.getScriptName()} hostname`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()} n00dles`);
        return;
    }

    let [results, isFound] = findPath(ns, target, ns.getHostname(), [], [], false);
    if (isFound) {
        ns.tprint(`connect ${results.join('; connect ')}`);
    } else {
        ns.tprint(`${target} not found`);
    }
}
