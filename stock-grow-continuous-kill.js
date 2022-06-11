import { threadsPossible } from 'common.js'

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    const hostname = args._[0];
    if (args.help || !hostname) {
        ns.tprint('This script will "grow" a server for the purpose of increasing its company\'s stock price');
        ns.tprint(`USAGE: run ${ns.getScriptName()} SERVER_NAME`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()} n00dles`);
        return;
    }

    //ns.disableLog('kill');

    const childScript = 'stock-grow.js';
    let i = 0;
    let numKillsFailed = 0;
    while (true) {
        let killSuccessful = ns.kill(childScript, ns.getHostname(), hostname, i++);
        if ((!killSuccessful) && (++numKillsFailed >= 10)){
            return
        }
    }
}
