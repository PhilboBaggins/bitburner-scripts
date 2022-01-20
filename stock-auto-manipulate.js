/*
WDS   = Watchdog Security
*/


const STOCK_TO_SERVER = {
    'FSIG': '4sigma', // Four Sigma
    'AERO': 'aerocorp', // AeroCorp
    //'': 'aevum-police',
    'APHE': 'alpha-ent', // Alpha Enterprises
    //'': 'applied-energetics',
    //'': 'avmnite-02h',
    //'': 'b-and-a',
    'BLD': 'blade', // Blade Industries
    'CTYS': 'catalyst', // Catalyst Ventures
    'CLRK': 'clarkinc', // Clark Incorporated
    'CTK': 'comptek', // CompuTek
    //'': 'crush-fitness',
    //'': 'CSEC',
    //'': 'darkweb',
    'DCOMM': 'defcomm', // Defcomm
    //'': 'deltaone',
    'ECP': 'ecorp', // ECorp
    'FNS': 'foodnstuff', // FoodNStuff
    //'': 'fulcrumassets', // Maybe "Fulcrum Technologies" too????????????????????????
    'FLCM': 'fulcrumtech', // Fulcrum Technologies
    //'': 'galactic-cyber',
    'GPH': 'global-pharm', // Global Pharmaceuticals
    //'': 'harakiri-sushi',
    'HLS': 'helios', // Helios Labs
    //'': 'hong-fang-tea',
    //'': 'I.I.I.I',
    'ICRS': 'icarus', // Icarus Microsystems
    //'': 'infocomm',
    //'': 'iron-gym',
    'JGN': 'joesguns', // Joes Guns
    //'': 'johnson-ortho',
    'KGI': 'kuai-gong', // KuaiGong International
    'LXO': 'lexo-corp', // LexoCorp
    //'': 'max-hardware',
    'MGCP': 'megacorp', // MegaCorp
    'MDYN': 'microdyne', // Microdyne Technologies
    //'': 'millenium-fitness',
    //'': 'n00dles',
    //'': 'nectar-net',
    //'': 'neo-net',
    'NTLK': 'netlink', // NetLink Technologies
    'NVMD': 'nova-med', // Nova Medical
    //'': 'nwo',
    'OMGA': 'omega-net', // Omega Software
    'OMN': 'omnia', // Omnia Cybersystems
    'OMTK': 'omnitek', // OmniTek Incorporated
    //'': 'phantasy',
    //'': 'powerhouse-fitness',
    'RHOC': 'rho-construction', // Rho Construction
    //'': 'rothman-uni',
    //'': 'run4theh111z',
    'SGC': 'sigma-cosmetics', // Sigma Cosmetics
    //'': 'silver-helix',
    //'': 'snap-fitness',
    'SLRS': 'solaris', // Solaris Space Systems
    'STM': 'stormtech', // Storm Technologies
    //'': 'summit-uni',
    'SYSC': 'syscore', // SysCore Securities
    //'': 'taiyang-digital',
    //'': 'The-Cave',
    //'': 'the-hub',
    'TITN': 'titan-labs', // Titan Laboratories
    //'': 'unitalife',
    'UNV': 'univ-energy', // Universal Energy
    'VITA': 'vitalife', // VitaLife
    //'': 'zb-def',
    //'': 'zb-institute',
    //'': 'zer0',
    //'': 'zeus-med',
}

function numberFormat(ns, num) {
    return ns.nFormat(num, '0.000a').padStart(8);
}

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    if (args.help) {
        ns.tprint('Automatically manipulate the the value of any shares I own by "growing" the servers of the company behind those shares');
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    ns.disableLog('sleep');
    ns.disableLog('exec');
    ns.disableLog('kill');

    // List of running stock manipulation (child) scripts
    let childScripts = {};

    function killChildScript(stock, pid) {
        let killed = ns.kill(pid);
        if (killed) {
            ns.print(`No longer manipulating ${stock.padEnd(4)}`);
            delete childScripts[stock];
        }
    }

    /*
    TODO: This currently fails because Bitburner thinks the code in this
          function is being run concurrently with the `ns.sleep()` at the
          bottom of this script, which is doesn't allow

    // On exit, close all child scripts
    ns.atExit(function() {
        for (let stock in childScripts) {
            let pid = childScripts[stock];
            killChildScript(stock, pid);
        }
    })
    */

    while (true) {
        const stocks = ns.stock.getSymbols().sort(function (a, b) { return ns.stock.getForecast(b) - ns.stock.getForecast(a); })
        for (const stock of stocks) {
            const [shares, avgPx, sharesShort, avgPxShort] = ns.stock.getPosition(stock);
            let companySever = STOCK_TO_SERVER[stock];
            if (companySever) {
                if (shares > 0) {
                    // Start a stock manipulation script (if not already running one)
                    if (!childScripts[stock]) {
                        // TODO: How many threads????????????????????????????????????????????????
                        let numThreads = 15000; //???????????????????????
                        if (numThreads > 0) {
                            let pid = ns.exec('stock-grow.js', ns.getHostname(), numThreads, companySever);
                            if (pid) {
                                childScripts[stock] = pid;
                                ns.print(`Manipulating ${stock.padEnd(4)} stock by growing ${companySever}`);
                            } else {
                                ns.print(`Failed to launch stock manipulation script on ${stock.padEnd(4)} / ${companySever}`);
                            }
                        }
                    }
                } else {
                    // Stop any stock manipulation script that are already running
                    let pid = childScripts[stock];
                    if (pid) {
                        killChildScript(stock, pid);
                    }
                }
            }
        }
        await ns.sleep(3 * 1000);
    }
}
