/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    if(args.help) {
        ns.tprint('This script will generate money by hacking a target server.');
        ns.tprint(`USAGE: run ${ns.getScriptName()}`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

	let hostname = ns.getHostname(); 
    while (true) {
        if (ns.getServerSecurityLevel(hostname) > ns.getServerMinSecurityLevel(hostname)) {
            await ns.weaken(hostname);
        } else if (ns.getServerMoneyAvailable(hostname) < ns.getServerMaxMoney(hostname)) {
            await ns.grow(hostname);
        } else {
            await ns.hack(hostname);
        }
    }
}
