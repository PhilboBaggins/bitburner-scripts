/** @param {NS} ns */
export async function main(ns) {
    let karma = ns.heart.break();
    ns.tprint('Karma: ', ns.formatNumber(karma));
}
