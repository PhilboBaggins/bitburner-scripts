function numberFormat(ns, num) {
    return ns.nFormat(num, '0.000a').padStart(8);
}

function percentageToDecimal(percentage) {
    return percentage / 100.0;
}

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    if (args.help) {
        ns.tprint('Automatically buy shares when they are forecast to increase in value');
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    // Game settings
    const sleepTime = 3 * 1000; // 3 seconds
    const commission = 100 * 1000; // $100,000

    // Configurables
    const reserveCash = 1000 * 1000 * 1000; // $1B
    const minForcast = percentageToDecimal(60); // Buy stocks that are at least this likely to increase in value
    const maxVolatility = percentageToDecimal(5); // Don't by stocks more volatile than this. TODO: Is this sensible? Maybe I should consider volatility and forcase together somehow, e.g. buy if (forecast - volatility) > 55%
    const minExpectedIncreasePercentage = 2;

    ns.disableLog('sleep');
    ns.disableLog('getServerMoneyAvailable');
    ns.disableLog('stock.buy');

    while (true) {
        const stocks = ns.stock.getSymbols().sort(function (a, b) { return ns.stock.getForecast(b) - ns.stock.getForecast(a); })
        for (const stock of stocks) {
            const [shares, avgPx, sharesShort, avgPxShort] = ns.stock.getPosition(stock);
            const volPer = ns.stock.getVolatility(stock);
            const askPrice = ns.stock.getAskPrice(stock);
            const forecast = ns.stock.getForecast(stock);
            const maxShares = ns.stock.getMaxShares(stock) - shares;
            const moneyAvailable = ns.getServerMoneyAvailable('home');
            const moneyToSpend = moneyAvailable - reserveCash - commission;
            const sharesCanAfford = moneyToSpend / askPrice;
            const sharesToBuy = Math.min(sharesCanAfford, maxShares);
            const minExpectedPercentProfit = (askPrice * sharesToBuy) * percentageToDecimal(minExpectedIncreasePercentage);
            if ((sharesToBuy > 0) && (forecast >= minForcast) && (volPer <= maxVolatility)) {
                // Only buy if our expected minimum profit will cover the cost of the buy/sell commissions
                if (minExpectedPercentProfit > (2 * commission)) {
                    const buyPricePerShare = ns.stock.buy(stock, sharesToBuy);
                    const buyPrice = buyPricePerShare * sharesToBuy;
                    ns.print(`Bought ${numberFormat(ns, sharesToBuy)} shares of ${stock.padEnd(4)} for $${numberFormat(ns, buyPrice)}`);
                }
            }
        }
        await ns.sleep(sleepTime);
    }
}