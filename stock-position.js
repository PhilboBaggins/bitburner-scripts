import { numberFormat } from 'common.js'

function stockPositionInDollars(ns, stock) {
    const [shares, avgPx, sharesShort, avgPxShort] = ns.stock.getPosition(stock);
    return ns.stock.getSaleGain(stock, shares, 'Long');
}

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    if (args.help) {
        ns.tprint('Show current stock position');
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    // Game settings
    const commission = 100 * 1000; // $100,000

    var totalShares = 0;
    var totalValue = 0;
    var totalProfit = 0;
    const stocks = ns.stock.getSymbols().sort(function (a, b) { return stockPositionInDollars(ns, b) - stockPositionInDollars(ns, a); })
    for (const stock of stocks) {
        const [shares, avgPx, sharesShort, avgPxShort] = ns.stock.getPosition(stock);
        if (shares > 0) {
            const value = stockPositionInDollars(ns, stock);
            const estProfit = value - (shares * avgPx) - (2 * commission);
            ns.tprint(`${stock.padStart(5)}: ${numberFormat(ns, shares)} shares valued at $${numberFormat(ns, value)} with a potential profit of $${numberFormat(ns, estProfit)} (${ns.nFormat(estProfit / value, '0%').padStart(4)})`);
            totalShares += shares;
            totalValue += value;
            totalProfit += estProfit;
        }
    }

    ns.tprint(`Total: ${numberFormat(ns, totalShares)} shares valued at $${numberFormat(ns, totalValue)} with a potential profit of $${numberFormat(ns, totalProfit)} (${ns.nFormat(totalProfit / totalValue, '0%').padStart(4)})`);
}
