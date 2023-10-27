/** @param {NS} ns **/
export async function main(ns) {

    // Purchase tor
    let gotTor = ns.singularity.purchaseTor();
    if (!gotTor) {
        ns.tprint('Unable to purchase TOR');
    }

    // Purchase programs fron darkweb
    let availablePrograms = ns.singularity.getDarkwebPrograms();
    for (let i = 0; i < availablePrograms.length; i++) {
        let programName = availablePrograms[i];
        let programCost = ns.singularity.getDarkwebProgramCost(programName);
        if (programCost > 0) {
            let purchased = ns.singularity.purchaseProgram(programName);
            ns.tprint(`${purchased ? 'Successfully purchased' : 'Failed to purchase'} ${programName} for $${ns.nFormat(programCost, '0a')}`);
        }
    }
}
