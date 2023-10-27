import { threadsPossible } from 'common.js'

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    const childScript = args._[0];
    if (args.help || !childScript) {
        ns.tprint('Prints the number of threads you could run another script with given the available RAM');
        ns.tprint(`USAGE: run ${ns.getScriptName()} script`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()} stock-grow.js`);
        return;
    }

    const threads = threadsPossible(ns, childScript, ns.getHostname());
    ns.tprint(`You could run '${childScript}' with ${ns.nFormat(threads, '0.000a')} threads`);
}
