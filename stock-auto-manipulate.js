import { getServerForStock } from './common.js'

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
    let runningTime = {};

    function killChildScript(stock, pid) {
        let killed = ns.kill(pid);
        if (killed) {
            delete childScripts[stock];
            const runningTime = getRunningTime(stock);
            ns.print(`No longer manipulating ${stock.padEnd(4)} - Tried for ${runningTime}`);
        }
    }

    function recordRunningTime(stock) {
        if (!runningTime[stock]) {
            runningTime[stock] = new Date();
        }
    }
    function getRunningTime(stock) {
        const endDate = new Date();
        const startDate = runningTime[stock];
        if (startDate) {
            delete runningTime[stock];
            const diffMilliseconds = endDate.getTime() - startDate.getTime();
            return ns.tFormat(diffMilliseconds);
        } else {
            return '?????';
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
            let companySever = getServerForStock(stock);
            if (companySever) {
                if (shares > 0) {
                    // Start a stock manipulation script (if not already running one)
                    if (!childScripts[stock]) {
                        // TODO: How many threads????????????????????????????????????????????????????
                        let numThreads = 15000; //???????????????????????
                        if (numThreads > 0) {
                            let pid = ns.exec('stock-grow.js', ns.getHostname(), numThreads, companySever);
                            if (pid) {
                                recordRunningTime(stock);
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
