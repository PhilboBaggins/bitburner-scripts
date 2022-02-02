import { threadsPossible } from 'common.js'

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    const childScript = args._[0];
    const childScriptArgs = args._.slice(1);
    if (args.help || !childScript) {
        ns.tprint('Run another script with the maximum number of threads possible');
        ns.tprint(`Usage: run ${ns.getScriptName()} script [args-for-child-script...]`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()} just-hack.js n00dles`);
        return;
    }

    const threads = threadsPossible(ns, childScript,  ns.getHostname());
    ns.tprint(`Launching script '${childScript}' with ${threads} threads`);
    if (threads > 0) {
        ns.spawn(childScript, threads, ...childScriptArgs);
    }
}
