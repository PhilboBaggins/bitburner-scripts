const SECONDS_IN_A_WEEK = 60 * 60 * 24 * 7;
const RESERVE_CASH = 1000;

function nodeMaxedOut(ns, nodeIdx) {
    return ((ns.hacknet.getCoreUpgradeCost(nodeIdx, 1) === Infinity)
        && (ns.hacknet.getLevelUpgradeCost(nodeIdx, 1) === Infinity)
        && (ns.hacknet.getRamUpgradeCost(nodeIdx, 1) === Infinity));
}

function allNodesMaxedOut(ns) {
    for (let nodeIdx = 0; nodeIdx < ns.hacknet.numNodes(); nodeIdx++) {
        if (!nodeMaxedOut(ns, nodeIdx))
            return false;
    }

    // Made it to the end without returing early, so all nodes must be maxed out
    return true;
}

function worthPurchasingMoreNodes(ns) {
    // Need to fully upgrade the first node in order to determine the max production rate for a single node...
    if ((ns.hacknet.numNodes() <= 0) || (!nodeMaxedOut(ns, 0)))
        return false;

    // ... then use that max production rate to get the amount earned in a week ...
    // TODO: Is one week's production a sensible value?
    let maxProductionFor1Week = ns.hacknet.getNodeStats(0).production * SECONDS_IN_A_WEEK;

    // ... only buy a new node if its cost is less than a weeks production
    return ns.hacknet.getPurchaseNodeCost() < maxProductionFor1Week;
}

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    if (args.help) {
        ns.tprint('Automatically purchase and upgrade hacknet nodes');
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    ns.disableLog('sleep');
    ns.disableLog('getServerMoneyAvailable');

    function cashAvail() {
        return ns.getServerMoneyAvailable('home') - RESERVE_CASH;
    }

    while (true) {
        // Purchase first hacknet node
        if ((ns.hacknet.numNodes() == 0) && (cashAvail() >= ns.hacknet.getPurchaseNodeCost())) {
            ns.print('Purchasing first hacknet node');
            ns.hacknet.purchaseNode();
        }

        // Upgrade all existing nodes
        for (let nodeIdx = 0; nodeIdx < ns.hacknet.numNodes(); nodeIdx++) {
            while (cashAvail() >= ns.hacknet.getCoreUpgradeCost(nodeIdx, 1)) {
                ns.print(`Upgrading cores for hacknet node index ${nodeIdx}`)
                ns.hacknet.upgradeCore(nodeIdx, 1);
            }
            while (cashAvail() >= ns.hacknet.getLevelUpgradeCost(nodeIdx, 1)) {
                ns.print(`Upgrading level for hacknet node index ${nodeIdx}`)
                ns.hacknet.upgradeLevel(nodeIdx, 1);
            }
            while (cashAvail() >= ns.hacknet.getRamUpgradeCost(nodeIdx, 1)) {
                ns.print(`Upgrading RAM for hacknet node index ${nodeIdx}`)
                ns.hacknet.upgradeRam(nodeIdx, 1);
            }
        }

        // If it's worth purchasing a new node, then do so whenever I can afford them
        while (worthPurchasingMoreNodes(ns) && (cashAvail() >= ns.hacknet.getPurchaseNodeCost())) {
            ns.print('Purchasing new hacknet node');
            ns.hacknet.purchaseNode();
        }

        // If it's not worth purchasing new nodes and all all existing nodes are fully upgraded, then I guess we're done
        if (!worthPurchasingMoreNodes(ns) && allNodesMaxedOut(ns)) {
            ns.print("Maxed out all existing hacknet nodes :) ... and it doesn't seem worth buying any more");
            return;
        }

        // Wait a little before going around again
        await ns.sleep(5 * 1000);
    }
}
