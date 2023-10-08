import { scanAndRun, findPath } from 'common.js'

function runExeIfAvailable(ns, host, exeName, func) {
    if (ns.fileExists(exeName, 'home')) {
        //ns.tprint(`    Running ${exeName}`);
        func(host);
        return 1;
    }
    return 0;
}

async function installBackdoor(ns, target) {
    if (ns.getServer(target).backdoorInstalled) {
        ns.tprint('    Backdoor already installed');
        return;
    }

    if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(target)) {
        ns.tprint(`    Unable to install backdoor: insufficient hacking level`);
        return;
    }

    // TODO: Check if signularity is available

    let startingServer = ns.getHostname();
    if (startingServer != target) {
        // Connect through intermediary servers to get to target

        let [pathToTarget, isFound] = findPath(ns, target, startingServer, [], [], false);
        if (!isFound) {
            ns.tprint(`    Unable to installing backdoor: ${target} not found`);
            return;
        }
        //ns.tprint(`    Path to target: ${pathToTarget.join(' -> ')}`);

        ns.singularity.connect(startingServer);
        for (let i = 0; i < pathToTarget.length; i++) {
            //ns.tprint(`    Connecting to intermediate server ${pathToTarget[i]}`);
            let connected = ns.singularity.connect(pathToTarget[i]);
            if (!connected) {
                ns.tprint(`    Unable to install backdoor: failed to connect to intermediate server ${pathToTarget[i]}`);
                return;
            }
        }
    }

    ns.tprint('    Installing backdoor');
    await ns.singularity.installBackdoor();
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

    let startingServer = ns.getHostname();
    await scanAndRun(ns, async function(host) {
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
            await installBackdoor(ns, host);
        } else if (numPortsOpen >= ns.getServerNumPortsRequired(host)) {
            ns.tprint('    Running NUKE.exe');
            ns.nuke(host);
            numServersWithRoot++;
            numServersWithRootNew++;
            await installBackdoor(ns, host);
        } else {
             ns.tprint('    Unable to run NUKE.exe at this time');
        }
    });

    let rootPercentage = numServersWithRoot * 100 / numServers;
    ns.tprint('');
    ns.tprint(`You just gained root access to ${numServersWithRootNew} servers`);
    ns.tprint(`You now have root access to ${numServersWithRoot} of ${numServers} servers (${rootPercentage.toFixed(2)}%)`);

    //ns.tprint(`Returning to staring server: ${startingServer}`);
    ns.singularity.connect(startingServer);
}
