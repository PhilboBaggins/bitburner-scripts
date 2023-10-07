import { scanAndRun } from 'common.js'

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    if (args.help) {
        ns.tprint('??????????????????????????????????');
        ns.tprint('??????????????????????????????????');
        ns.tprint('??????????????????????????????????');
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        return;
    }

    ns.disableLog('scan');
    ns.disableLog('getHackingLevel');
    ns.disableLog('getServerRequiredHackingLevel');
    ns.disableLog('getServerMaxMoney');
    ns.disableLog('getServerMinSecurityLevel');
    ns.disableLog('getServerSecurityLevel');
    ns.disableLog('getServerMoneyAvailable');
    ns.print('');

    while (true) {
        await scanAndRun(ns, async function (hostname) {
            if ((ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(hostname))
             && (ns.getServer(hostname).moneyAvailable > 0.0)) {
                ns.print('## Prepping ' + hostname + ' for future hacks');

                // TODO: Are these sensible values???
                let thresholdMoney = ns.getServerMaxMoney(hostname) * 0.90;
                let thresholdSecurity = ns.getServerMinSecurityLevel(hostname) + 2.5;

                while (ns.getServerMoneyAvailable(hostname) < thresholdMoney)
                    await ns.grow(hostname);

                while (ns.getServerSecurityLevel(hostname) > thresholdSecurity)
                    await ns.weaken(hostname);

                let moneyAvailableNow = ns.getServerMoneyAvailable(hostname);
                ns.print('Money now available on ' + hostname + ': ' + ns.nFormat(moneyAvailableNow, '0.000a'));
                ns.print('');
                ns.print('');
            }
        });
    }
}
