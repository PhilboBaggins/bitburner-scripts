
function numberFormat(num) {
    let suffixes = ['','k','M','B','T'];
    let e = Math.floor(Math.log(num) / Math.log(1000));
    return (num / Math.pow(1000, e)).toFixed(2) + suffixes[e];
}

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

    const stocks = ns.stock.getSymbols().sort(function (a, b) { return stockPositionInDollars(ns, b) - stockPositionInDollars(ns, a); })
    for (const stock of stocks) {
        const [shares, avgPx, sharesShort, avgPxShort] = ns.stock.getPosition(stock);
        if (shares > 0) {
            const value = stockPositionInDollars(ns, stock);
            const estProfit = value - (shares * avgPx);
            ns.tprint(`${stock.padStart(4)}: ${numberFormat(shares)} shares totalling $${numberFormat(value)} ($${numberFormat(estProfit)} profit)`);
        }
    }
}
