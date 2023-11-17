import { showData } from 'common.js'

/** @param {NS} ns **/
export async function main(ns) {
    await showData(ns, 1000, async function(ns) {
        let karma = ns.heart.break();
        return 'Current Karma : ' + ns.formatNumber(karma);
    });
}
