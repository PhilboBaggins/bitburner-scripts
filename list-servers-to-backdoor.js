import { listServers } from 'common.js'

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    if (args.help) {
        ns.tprint('List all servers which you haven\'t installed a backdoor on yet');
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    ns.tprint(`Servers without a backdoor: ${serversToBackdoor}`);
    var serversToBackdoor = 0;
    const servers = listServers(ns);
    for (const server of servers) {
        const host = ns.getServer(server);
        if (!host.backdoorInstalled) {
            serversToBackdoor += 1;
            ns.tprint(`* ${server}`);
        }
    };
    ns.tprint(`Number of servers without a backdoor: ${serversToBackdoor} (${ns.nFormat(serversToBackdoor / servers.length, '%')})`);
}
