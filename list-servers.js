import { listServers } from './common.js'

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

    let colWidthHostName = 20;
    let colWidthHackingSkill = 10;
    let colWidthAdmin = 10;
    let colWidthBackdoor = 10;
    let colWidthCash = 10;
    let colWidthRam = 10 + 1;

    function printTableHeader() {
        ns.tprint(
            '+'.padEnd(3 + colWidthHostName, '-'),
            '+'.padEnd(3 + colWidthHackingSkill, '-'),
            '+'.padEnd(3 + colWidthAdmin, '-'),
            '+'.padEnd(3 + colWidthBackdoor, '-'),
            '+'.padEnd(3 + colWidthCash, '-'),
            '+'.padEnd(3 + colWidthRam, '-'),
            '+'
        );
        ns.tprint(
            '| Server name'.padEnd(2 + colWidthHostName),
            ' | Level'.padEnd(3 + colWidthHackingSkill),
            ' | Admin?'.padEnd(3 + colWidthAdmin),
            ' | Backdoor?'.padEnd(3 + colWidthBackdoor),
            ' | Cash'.padEnd(3 + colWidthCash),
            ' | Ram'.padEnd(3 + colWidthRam),
            ' |'
        );
        ns.tprint(
            '+'.padEnd(3 + colWidthHostName, '-'),
            '+'.padEnd(3 + colWidthHackingSkill, '-'),
            '+'.padEnd(3 + colWidthAdmin, '-'),
            '+'.padEnd(3 + colWidthBackdoor, '-'),
            '+'.padEnd(3 + colWidthCash, '-'),
            '+'.padEnd(3 + colWidthRam, '-'),
            '+'
        );
    }
    const servers = listServers(ns).sort(function (a, b) {
        return ns.getServer(b).requiredHackingSkill - ns.getServer(a).requiredHackingSkill;
    });

    printTableHeader();
    for (const server of servers) {
        const host = ns.getServer(server);
        ns.tprint(
            '| ', server.padEnd(colWidthHostName),
            ' | ', ns.nFormat(host.requiredHackingSkill, '0').padStart(colWidthHackingSkill),
            ' | ', (host.hasAdminRights) ? 'Yes'.padStart(colWidthAdmin) : ''.padStart(colWidthAdmin),
            ' | ', (host.backdoorInstalled) ? 'Yes'.padStart(colWidthBackdoor) : ''.padStart(colWidthBackdoor),
            ' | ', ns.nFormat(host.moneyAvailable, '0.0a').padStart(colWidthCash),
            ' | ', ns.nFormat(host.maxRam, '0.0a').padStart(colWidthRam / 2), 'G', 
                   ns.nFormat(Math.ceil(host.ramUsed / host.maxRam), '0%').padStart(colWidthRam / 2),
            ' |'
        );
    };
    printTableHeader();
    ns.tprint(`Number of servers: ${servers.length}`);
}
