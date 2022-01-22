const SECONDS_IN_A_WEEK = 60 * 60 * 24 * 7;
const RESERVE_CASH = 1000;

function allNodesMaxedOut(ns) {
	for (let nodeIdx = 0; nodeIdx < ns.hacknet.numNodes(); nodeIdx++) {
		let maxedOut = ((ns.hacknet.getCoreUpgradeCost(nodeIdx, 1) === Infinity)
					 && (ns.hacknet.getLevelUpgradeCost(nodeIdx, 1) === Infinity)
					 && (ns.hacknet.getRamUpgradeCost(nodeIdx, 1) === Infinity));
		if (!maxedOut) {
			return false;
		}
	}

	// Made it to the end without returing early, so all nodes must be maxed out
	return true;
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

		// Once all existing nodes are fully upgraded ...
		if (allNodesMaxedOut(ns)) {
			// ... check to see if we it seems worth buying more servers
			// TODO: Is one week's production a sensible value?
			let maxProductionFor1Week = ns.hacknet.getNodeStats(0).production * SECONDS_IN_A_WEEK;
			if (ns.hacknet.getPurchaseNodeCost() >= maxProductionFor1Week) {
				ns.print("Maxed out all existing hacknet nodes :) ... and it doesn't seem worth buying any more");
				return;
			}

			// ... or purchase new nodes when I can afford them
			while (cashAvail() >= ns.hacknet.getPurchaseNodeCost()) {
				ns.print('Purchasing new hacknet node');
				ns.hacknet.purchaseNode();
			}
		}

		// Wait a little before going around again
		await ns.sleep(5 * 1000);
	}
}
