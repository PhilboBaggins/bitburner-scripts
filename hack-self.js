/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    if (args.help) {
        ns.tprint('This script will generate money by hacking a target server.');
        ns.tprint(`USAGE: run ${ns.getScriptName()}`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    let hostname = ns.getHostname(); 

    // TODO: Are these sensible values???
    let thresholdMoney = ns.getServerMaxMoney(hostname) * 0.75;
    let thresholdSecurity = ns.getServerMinSecurityLevel(hostname) + 5;

    while (true) {
        if (ns.getServerSecurityLevel(hostname) > thresholdSecurity) {
            await ns.weaken(hostname);
        } else if (ns.getServerMoneyAvailable(hostname) < thresholdMoney) {
            await ns.grow(hostname);
        } else {
            await ns.hack(hostname);
        }
    }
}
