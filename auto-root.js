import { scanAndRun } from './common.js'

function runExeIfAvailable(ns, host, exeName, func) {
    if (ns.fileExists(exeName, 'home')) {
        ns.tprint(`    Running ${exeName}`);
        func(host);
        return 1;
    }
    return 0;
}

/** @param {NS} ns **/
async function installBackdoor(ns) {
    // TODO: Install backdoor ... once I know what that is
    // See https://github.com/danielyxie/bitburner/blob/dev/markdown/bitburner.singularity.installbackdoor.md
    //ns.tprint(`    Installing backdoor`);
    //await ns.installBackdoor();
}

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

    // TODO: Don't run on my own servers
    //const boughtServers = ns.getPurchasedServers(ns);

    var numServers = 0;
    var numServersWithRoot = 0;
    var numServersWithRootNew = 0;

    await scanAndRun(ns, '', 'home', async function(host) {
        ns.tprint(`${host}:`);
        numServers++;

        var numPortsOpen = 0;
        numPortsOpen += runExeIfAvailable(ns, host, 'BruteSSH.exe', ns.brutessh);
        numPortsOpen += runExeIfAvailable(ns, host, 'FTPCrack.exe', ns.ftpcrack);
        numPortsOpen += runExeIfAvailable(ns, host, 'HTTPWorm.exe', ns.httpworm);
        numPortsOpen += runExeIfAvailable(ns, host, 'relaySMTP.exe', ns.relaysmtp);
        numPortsOpen += runExeIfAvailable(ns, host, 'SQLInject.exe', ns.sqlinject);

        if (ns.hasRootAccess(host)) {
            ns.tprint('    Already have root access on this server');
            numServersWithRoot++;
            await installBackdoor(ns);
        } else if (numPortsOpen >= ns.getServerNumPortsRequired(host)) {
            ns.tprint('    Running NUKE.exe');
            ns.nuke(host);
            numServersWithRoot++;
            numServersWithRootNew++;
            await installBackdoor(ns);
        } else {
             ns.tprint('    Unable to run NUKE.exe at this time');
        }
    });

    let rootPercentage = numServersWithRoot * 100 / numServers;
    ns.tprint('');
    ns.tprint(`You just gained root access to ${numServersWithRootNew} servers`);
    ns.tprint(`You now have root access to ${numServersWithRoot} of ${numServers} servers (${rootPercentage.toFixed(2)}%)`);
}
