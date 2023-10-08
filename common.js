
export const gameConstants = {
    'stockMarket': {
        'interval':     3 * 1000, // 3 seconds
        'commission': 100 * 1000, // $100,000
    }
}

export function printEverywhere(ns, ...msg) {
    ns.print(...msg);
    ns.tprint(...msg);
}

export async function execAndWait(ns, childScript, host, numThreads, ...childScriptArgs) {
    const pid = ns.exec(childScript, host, numThreads, ...childScriptArgs);

    while (ns.isRunning(pid, host)) {
        await ns.sleep(1 * 1000); // Wait 1 second
    }
}

export async function execAndWaitSimple(ns, childScript, ...childScriptArgs) {
    await execAndWait(ns, childScript, ns.getHostname(), 1, ...childScriptArgs);
}

// Scan for all servers and run an async callbacck function for each
// TODO: Consider starting scan from something other than 'home'
export async function scanAndRun(ns, asyncFunc) {
    async function scanAndRunInner(ns, parent, server, asyncFunc) {
        const children = ns.scan(server);
        for (let child of children) {
            if (parent == child) {
                continue;
            }
            await asyncFunc(child);
            await scanAndRunInner(ns, server, child, asyncFunc);
        }
    }

    return scanAndRunInner(ns, '', 'home', asyncFunc);
}

// Scan for all servers and return a list of all those found
// TODO: Consider starting scan from something other than 'home'
export function listServers(ns) {
    var retVal = [];
    function scan(parent, server) {
        const children = ns.scan(server);
        for (let child of children) {
            if (parent == child) {
                continue;
            }
            retVal.push(child);
            scan(server, child);
        }
    }
    scan('', 'home');
    return retVal;
}

// Stolen from https://www.reddit.com/r/Bitburner/comments/rm097d/find_server_path_script/
export function findPath(ns, target, serverName, serverList, ignore, isFound) {
	ignore.push(serverName);
	let scanResults = ns.scan(serverName);
	for (let server of scanResults) {
		if (ignore.includes(server)) {
			continue;
		}
		if (server === target) {
			serverList.push(server);
			return [serverList, true];
		}
		serverList.push(server);
		[serverList, isFound] = findPath(ns, target, server, serverList, ignore, isFound);
		if (isFound) {
			return [serverList, isFound];
		}
		serverList.pop();
	}
	return [serverList, false];
}

export function numberFormat(ns, num) {
    return ns.nFormat(num, '0.000a').padStart(8);
}

export function percentageToDecimal(percentage) {
    return percentage / 100.0;
}

export function threadsPossible(ns, script, hostname) {
    return Math.floor((ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname)) / ns.getScriptRam(script));
}

export function percentRamUsed(ns, hostname) {
    return ns.getServerUsedRam(hostname) / ns.getServerMaxRam(hostname) * 100.0;
}

export function createTable(ns, columnNames) {
    let tableBorder = [];
    let tableHeading = [];
    tableBorder.push('+');
    tableHeading.push('| ');
    for (const colName of columnNames) {
        tableBorder.push('+'.padStart(3 + colName.length, '-'));
        tableHeading.push((colName + ' | ').padStart(colName.length, ' '));
    }

    return {
        printHeader: function(ns) {
            ns.tprint(...tableBorder);
            ns.tprint(...tableHeading);
            ns.tprint(...tableBorder);
        },
        printRow: function(ns, ...cellValues) {
            if (cellValues.length == columnNames.length) {
                let printArgs = [];
                printArgs.push('| ');
                for (var i = 0; i < columnNames.length; i++) {
                    let cellVal = cellValues[i];
                    let colTitle = columnNames[i];
                    printArgs.push(cellVal.padStart(colTitle.length));
                    printArgs.push(' | ');
                }
                ns.tprint(...printArgs);
            } else {
                ns.tprint('Invalid number of arguements given to `printRow()`');
            }
        }
    };
}

export function getStockTotalValue(ns, stock) {
    return ns.stock.getAskPrice(stock) * ns.stock.getMaxShares(stock);
}

export const STOCK_TO_SERVER = {
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
    'CTK': 'computek', // CompuTek
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

    //
    // TODO: What to do with this stock? Does it have a server??
    //WDS   = Watchdog Security
    //
}

export function getServerForStock(stock) {
    return STOCK_TO_SERVER[stock];
}
