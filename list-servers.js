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
        'Ram'.padEnd(6),
        'Ram used'.padEnd(5),
    ]);

    const servers = listServers(ns).sort(function (a, b) {
        return ns.getServer(b).requiredHackingSkill - ns.getServer(a).requiredHackingSkill;
    });

    table.printHeader(ns);
    for (const server of servers) {
        const host = ns.getServer(server);
        table.printRow(ns,
            server,
            ns.nFormat(host.requiredHackingSkill, '0'),
            (host.hasAdminRights) ? 'Yes' : '',
            (host.backdoorInstalled) ? 'Yes' : '',
            ns.nFormat(host.moneyAvailable, '0.0a'),
            ns.nFormat(host.maxRam, '0.0a') + 'G',
            ns.nFormat(Math.ceil(host.ramUsed / host.maxRam), '0%'),
        );
    };
    table.printHeader(ns);
    ns.tprint(`Number of servers: ${servers.length}`);
}
