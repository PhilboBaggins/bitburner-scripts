/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    const hostname = args._[0];
    if(args.help || !hostname) {
        ns.tprint('This script will "weaken" a server for the purpose of decreasing its company\'s stock price');
        ns.tprint(`USAGE: run ${ns.getScriptName()} SERVER_NAME`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()} n00dles`);
        return;
    }
    while (true) {
        await ns.weaken(hostname, { stock: true });
    }
}
