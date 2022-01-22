function numberFormat(ns, num) {
    return ns.nFormat(num, '0.000a').padStart(8);
}

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    if (args.help) {
        ns.tprint('Automatically sell shares when their forecast to decrease in value');
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    // Game settings
    const sleepTime = 3 * 1000; // 3 seconds
    const commission = 100 * 1000; // $100,000

    ns.disableLog('sleep');
    ns.disableLog('stock.sell');

    while (true) {
        const stocks = ns.stock.getSymbols().sort(function (a, b) { return ns.stock.getForecast(b) - ns.stock.getForecast(a); })
        for (const stock of stocks) {
            const [shares, avgPx, sharesShort, avgPxShort] = ns.stock.getPosition(stock);
            const forecast = ns.stock.getForecast(stock);
            if ((shares > 0) && (forecast < 0.5)) {
                const sellPricePerShare = ns.stock.sell(stock, shares);
                const sellPrice = sellPricePerShare * shares;
                const estProfit = sellPrice - (shares * avgPx) - (2 * commission);
                let msg = `Sold ${numberFormat(ns, shares)} shares of ${stock.padEnd(4)} for $${numberFormat(ns, sellPrice)} for $${numberFormat(ns, estProfit)} profit (${ns.nFormat(estProfit / sellPrice, '0%')})`;
                ns.print(msg);
                ns.toast(msg);
            }
        }
        await ns.sleep(sleepTime);
    }
}
