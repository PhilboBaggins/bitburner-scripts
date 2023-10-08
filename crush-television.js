import { findPath } from 'common.js'

/** @param {NS} ns **/
export async function main(ns) {
    const target = 'w0r1d_d43m0n';

    const args = ns.flags([['help', false]]);
    if (args.help) {
        ns.tprint(`Backdoor ${target} to destroy this BitNode`);
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        return;
    }

    // Connect through intermediary servers to get to target
    let [pathToTarget, isFound] = findPath(ns, target, ns.getHostname(), [], [], false);
    if (!isFound) {
        ns.tprint(`${target} not found`);
        return;
    }
    for (let i = 0; i < pathToTarget.length; i++) {
        let connected = ns.singularity.connect(pathToTarget[i]);
        if (!connected) {
            ns.tprint(`Failed to connect to intermediate server ${pathToTarget[i]}`);
            return;
        }
    }

    ns.tprint('Installing backdoor');
    await ns.singularity.installBackdoor();
}
