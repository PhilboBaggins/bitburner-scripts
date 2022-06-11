import { listServers, createTable } from 'common.js'

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    if (args.help) {
        ns.tprint('List all servers and info about them');
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    let table = createTable(ns, [
        'Server name'.padEnd(20),
        'Level'.padEnd(10),
        'Admin?'.padEnd(10),
        'Backdoor?'.padEnd(10),
        'Cash'.padEnd(10),
        'Cash %'.padEnd(5),
        'Ram'.padEnd(6),
        'Ram used'.padEnd(5),
    ]);

    const servers = listServers(ns).sort(function (a, b) {
        //return ns.getServer(b).requiredHackingSkill - ns.getServer(a).requiredHackingSkill;
        //return ns.getServer(a).maxRam - ns.getServer(b).maxRam;
        //return ns.getServer(a).moneyAvailable - ns.getServer(b).moneyAvailable;
        return ns.getServer(a).moneyMax - ns.getServer(b).moneyMax;
    });

    let total    = { 'level': 0, 'admin': 0, 'backdoor': 0, 'cash': 0, 'cashPercentage': 0, 'maxRam': 0, 'ramUsed': 0 };
    let hackable = { 'level': 0, 'admin': 0, 'backdoor': 0, 'cash': 0, 'cashPercentage': 0, 'maxRam': 0, 'ramUsed': 0 };
    let numHackable = 0;

    function percentage(portion, max) {
        if ((portion > 0) && (max > 0)) {
            return Math.ceil(portion / max);
        } else if ((portion == 0) && (max == 0)) {
            return 1; // 100%
        } else if (max > 0) {
            return 0;
        } else {
            return NaN;
        }
    }

    function printRow(name, level, admin, backdoor, cash, maxRam, ramUsed, maxCash) {
        table.printRow(ns,
            name,
            ns.nFormat(level, '0'),
            admin ? 'Yes' : '',
            backdoor ? 'Yes' : '',
            ns.nFormat(cash, '0.0a'),
            ns.nFormat(percentage(cash, maxCash), '0%'),
            ns.nFormat(maxRam, '0.0a') + 'G',
            ns.nFormat(ramUsed, '0%'),
        );
    }

    function printRowTotals(name, totalsObj) {
        table.printRow(ns,
            name,
            '', // No point showing the total levels
            ns.nFormat(totalsObj['admin'],    '0a'),
            ns.nFormat(totalsObj['backdoor'], '0a'),
            ns.nFormat(totalsObj['cash'],     '0.0a'),
            ns.nFormat(totalsObj['cashPercentage'],  '0%'),
            ns.nFormat(totalsObj['maxRam'],   '0.0a') + 'G',
            ns.nFormat(totalsObj['ramUsed'],  '0%'),
        );
    }

    function printRowAverage(name, totalsObj, num) {
        table.printRow(ns,
            name,
            ns.nFormat(totalsObj['level']    / num, '0.0a'),
            ns.nFormat(totalsObj['admin']    / num, '0%'),
            ns.nFormat(totalsObj['backdoor'] / num, '0%'),
            ns.nFormat(totalsObj['cash']     / num, '0.0a'),
            ns.nFormat(totalsObj['cashPercentage']  / num, '0%'),
            ns.nFormat(totalsObj['maxRam']   / num, '0.0a') + 'G',
            ns.nFormat(totalsObj['ramUsed']  / num, '0%'),
        );
    }

    function addToTotals(server, level, admin, backdoor, cash, maxRam, ramUsed, maxCash) {
        total['level'] += level;
        total['admin'] += admin ? 1 : 0;
        total['backdoor'] += backdoor ? 1 : 0;
        total['cash'] += cash;
        total['cashPercentage'] += percentage(cash, maxCash);
        total['maxRam'] += maxRam;
        total['ramUsed'] += ramUsed;

        if ((level <= ns.getHackingLevel()) && !ns.getPurchasedServers().includes(server)) {
            hackable['level'] += level;
            hackable['admin'] += admin ? 1 : 0;
            hackable['backdoor'] += backdoor ? 1 : 0;
            hackable['cash'] += cash;
            hackable['cashPercentage'] += percentage(cash, maxCash);
            hackable['maxRam'] += maxRam;
            hackable['ramUsed'] += ramUsed;
            numHackable++;
        }
    }

    table.printHeader(ns);
    for (const server of servers) {
        const host = ns.getServer(server);
        printRow(   server, host.requiredHackingSkill, host.hasAdminRights, host.backdoorInstalled, host.moneyAvailable, host.maxRam, percentage(host.ramUsed, host.maxRam), host.moneyMax);
        addToTotals(server, host.requiredHackingSkill, host.hasAdminRights, host.backdoorInstalled, host.moneyAvailable, host.maxRam, percentage(host.ramUsed, host.maxRam), host.moneyMax);
    };
    table.printHeader(ns);
    printRowTotals('Total:', total);
    printRowTotals('Total (hackable):', hackable);
    printRowAverage('Average:', total, servers.length);
    printRowAverage('Average (hackable):', hackable, numHackable);
    table.printHeader(ns);

    ns.tprint(`Number of servers: ${servers.length}`);
    ns.tprint(`Number of hackable servers: ${numHackable}`);
}
