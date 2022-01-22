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

export function numberFormat(ns, num) {
    return ns.nFormat(num, '0.000a').padStart(8);
}

export function percentageToDecimal(percentage) {
    return percentage / 100.0;
}

export function threadsPossible(ns, script, hostname) {
    return Math.floor((ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname)) / ns.getScriptRam(script));
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
            let printArgs = [];
            printArgs.push('| ');
            for (var i = 0; i < columnNames.length; i++) {
                let cellVal = cellValues[i]; // TODO: What if caller didn't supply enough args?
                let colTitle = columnNames[i];
                printArgs.push(cellVal.padStart(colTitle.length));
                printArgs.push(' | ');
            }
            ns.tprint(...printArgs);
        }
    };
}
