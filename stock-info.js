import { createTable, numberFormat, getStockTotalValue, getServerForStock } from 'common.js'

function stockServerGrowTime(ns, stock) {
    let companyServer = getServerForStock(stock);
    return companyServer ? ns.getGrowTime(companyServer) : -1;
}

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
        'Server'.padEnd(20),
        'Forecast',
        'Volatility',
        'Max shares',
        'Ask price',
        'Value'.padStart(8),
        'Grow time'.padStart(30),
    ]);

    let totals = {
        'forecast': 0,
        'volatility': 0,
        'max-shares': 0,
        'ask-price': 0,
        'value': 0,
        'grow-time': 0,
    };

    const stocks = ns.stock.getSymbols().sort(function (a, b) {
        return getStockTotalValue(ns, a) - getStockTotalValue(ns, b);
        //return stockServerGrowTime(ns, a) - stockServerGrowTime(ns, b);
    })

    function printRow(stock, companyServer, forecast, volatility, maxShares, askPrice, value) {
        table.printRow(ns,
            stock,
            companyServer ? companyServer : '',
            ns.nFormat(forecast, '0.00%'),
            ns.nFormat(volatility, '0.00%'),
            numberFormat(ns, maxShares),
            numberFormat(ns, askPrice),
            numberFormat(ns, value),
            companyServer ? ns.tFormat(ns.getGrowTime(companyServer)) : '',
        );

        totals['forecast'] += forecast;
        totals['volatility'] += volatility;
        totals['max-shares'] += maxShares;
        totals['ask-price'] += askPrice;
        totals['value'] += value;
        totals['grow-time'] += companyServer ? ns.getGrowTime(companyServer) : 0;
    }

    function printTotalAndAverage() {
        table.printRow(ns,
            'Total:',
            '',
            '', // Doesn't make sense to display the total of forecast
            '', // Doesn't make sense to display the total of volatility
            numberFormat(ns, totals['max-shares']),
            numberFormat(ns, totals['ask-price']),
            numberFormat(ns, totals['value']),
            ns.tFormat(totals['grow-time']),
        );
        table.printRow(ns,
            'Average:',
            '',
            ns.nFormat(totals['forecast'] / stocks.length, '0.00%'),
            ns.nFormat(totals['volatility'] / stocks.length, '0.00%'),
            numberFormat(ns, totals['max-shares'] / stocks.length),
            numberFormat(ns, totals['ask-price'] / stocks.length),
            numberFormat(ns, totals['value'] / stocks.length),
            ns.tFormat(totals['grow-time'] / stocks.length),
        );
    }

    table.printHeader(ns);
    for (const stock of stocks) {
        printRow(stock,
            getServerForStock(stock),
            ns.stock.getForecast(stock),
            ns.stock.getVolatility(stock),
            ns.stock.getMaxShares(stock),
            ns.stock.getAskPrice(stock),
            getStockTotalValue(ns, stock));
    }
    table.printHeader(ns);
    printTotalAndAverage();
    table.printHeader(ns);
    ns.tprint(`Total number of stocks: ${stocks.length}`);
}
