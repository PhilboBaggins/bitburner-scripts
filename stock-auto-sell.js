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

    ns.disableLog('sleep');

    while (true) {
        const stocks = ns.stock.getSymbols().sort(function (a, b) { return ns.stock.getForecast(b) - ns.stock.getForecast(a); })
        for (const stock of stocks) {
            const [shares, avgPx, sharesShort, avgPxShort] = ns.stock.getPosition(stock);
            const forecast = ns.stock.getForecast(stock);
            if ((shares > 0) && (forecast < 0.5)) {
                const sellPricePerShare = ns.stock.sell(stock, shares);
                const sellPrice = sellPricePerShare * shares;
                const estProfit = sellPrice - (avgPx * shares);
                ns.tprint(`Sold ${shares} of ${stock} for $${sellPrice} (estimate profit: $${estProfit})`);
            }
        }
        await ns.sleep(6000);
    }
}
