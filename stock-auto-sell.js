import { gameConstants, numberFormat } from 'common.js'

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
    ns.disableLog('stock.sellStock');

    while (true) {
        const stocks = ns.stock.getSymbols()
        for (const stock of stocks) {
            const [shares, avgPx, sharesShort, avgPxShort] = ns.stock.getPosition(stock);
            const forecast = ns.stock.getForecast(stock);
            if ((shares > 0) && (forecast < 0.5)) {
                const sellPricePerShare = ns.stock.sellStock(stock, shares);
                const sellPrice = sellPricePerShare * shares;
                const estProfit = sellPrice - (shares * avgPx) - (2 * gameConstants.stockMarket.commission);
                let msg = `Sold ${numberFormat(ns, shares)} shares of ${stock.padEnd(4)} for $${numberFormat(ns, sellPrice)} for $${numberFormat(ns, estProfit)} profit (${ns.nFormat(estProfit / sellPrice, '0%').padStart(4)})`;
                ns.print(msg);
                ns.toast(msg);
            }
        }
        await ns.sleep(gameConstants.stockMarket.interval);
    }
}
