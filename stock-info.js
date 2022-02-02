import { createTable, numberFormat, getStockTotalValue, getServerForStock } from 'common.js'

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    if (args.help) {
        ns.tprint('????????????????????????????????????????????????????????????????????????');
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    const table = createTable(ns, [
        'Stock symbol',
        'Forecast',
        'Volatility',
        'Max shares',
        'Ask price',
        'Value'.padStart(8),
        'Grow time'.padStart(30),
    ]);

    const stocks = ns.stock.getSymbols().sort(function (a, b) {
        return getStockTotalValue(ns, a) - getStockTotalValue(ns, b);
    })

    table.printHeader(ns);
    for (const stock of stocks) {
        let companyServer = getServerForStock(stock);
        let growTime = companyServer ? ns.tFormat(ns.getGrowTime(companyServer)) : '';
        table.printRow(ns,
            stock,
            ns.nFormat(ns.stock.getForecast(stock), '0.00%'),
            ns.nFormat(ns.stock.getVolatility(stock), '0.00%'),
            numberFormat(ns, ns.stock.getMaxShares(stock)),
            numberFormat(ns, ns.stock.getAskPrice(stock)),
            numberFormat(ns, getStockTotalValue(ns, stock)),
            growTime,
        );
    }
    table.printHeader(ns);
}
