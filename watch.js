import { execAndWaitSimple } from './common.js'

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    const childScript = args._[0];
    const childScriptArgs = args._.slice(1);
    if (args.help || !childScript) {
        ns.tprint('Run another script every second');
        ns.tprint(`Usage: run ${ns.getScriptName()} script [args-for-child-script...]`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()} just-hack.js n00dles`);
        return;
    }

    while (true) {
        await execAndWaitSimple(ns, childScript, ...childScriptArgs);
        await ns.sleep(1); // TODO: This isn't really running once per second ... not unless the childScript executes in 0 milliseconds
    }
}
