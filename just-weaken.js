/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    const hostname = args._[0];
    if (args.help || !hostname) {
        ns.tprint('Weaken the specified server in a contnious loop');
		ns.tprint(`Usage: run ${ns.getScriptName()} hostname`);
		ns.tprint('Example:');
		ns.tprint(`> run ${ns.getScriptName()} n00dles`);
        return;
    }

    while (true) {
        await ns.weaken(hostname);
    }
}
