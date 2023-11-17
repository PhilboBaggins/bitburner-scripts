
const TICK = '✔️';
const CROSS = '❌';

class ReqAugumentations {
    constructor(number) {
        this.number = number;
    }

    /** @param {NS} ns **/
    test(ns) {
        return ns.sinularity.getOwnedAugmentations(false).length >= this.number;
    }

    /** @param {NS} ns **/
    testFriendly(ns) {
        if (ns.singularity.getOwnedAugmentations(false).length >= this.number) {
            ns.tprint(`* ${TICK} Got enough augumentations (${this.number})`);
        } else if (ns.singularity.getOwnedAugmentations(true).length >= this.number) {
            ns.tprint(`* ${TICK} Purchased enough augumentations (${this.number}) but will need to do a reset to install some of them`);
        } else {
            let installed = ns.singularity.getOwnedAugmentations(false).length;
            let purchased = ns.singularity.getOwnedAugmentations(true).length - installed;
            ns.tprint(`* ${CROSS} Don't have enough augmentations. ${this.number} needed, you have ${installed} installed and ${purchased} purchased but not yet installed`);
        }
    }
}

class ReqMoney {
    constructor(number) {
        this.number = number;
    }

    /** @param {NS} ns **/
    test(ns) {
        return ns.getPlayer().money >= this.number;
    }

    /** @param {NS} ns **/
    testFriendly(ns) {
        let moneyStr = ns.nFormat(this.number, '0.0a');
        if (this.test(ns)) {
            ns.tprint(`* ${TICK} Got enough monty (${moneyStr})`);
        } else {
            ns.tprint(`* ${CROSS} Don't have enough money. ${moneyStr} needed, you are ${ns.nFormat(this.number / ns.getPlayer().money, '0%')} percent of the way there.`);
        }
    }
}

class ReqHackingSkill {
    constructor(number) {
        this.number = number;
    }

    /** @param {NS} ns **/
    test(ns) {
        return ns.getPlayer().skills.hacking >= this.number;
    }

    /** @param {NS} ns **/
    testFriendly(ns) {
        if (this.test(ns)) {
            ns.tprint(`* ${TICK} Hacking skill is high enough (${this.number})`);
        } else {
            ns.tprint(`* ${CROSS} Hacking skill too low. ${this.number} needed, you are ${ns.nFormat(ns.getPlayer().skills.hacking / this.number, '0%')} of the way there`);
        }
    }
}

class ReqAllCombatStats {
    constructor(number) {
        this.number = number;
    }

    /** @param {NS} ns **/
    test(ns) {
        for (let gymtype in ns.enums.GymType) {
            if (ns.getPlayer().skills[gymtype] < this.number) {
                return false;
            }
        }

        // All checks passed
        return true;
    }

    /** @param {NS} ns **/
    testFriendly(ns) {
        ns.tprint('* Combat stats:');
        for (let gymtype in ns.enums.GymType) {
            if (ns.getPlayer().skills[gymtype] >= this.number) {
                ns.tprint(`    * ${TICK} ${gymtype} skill is high enough`);
            } else {
                ns.tprint(`    * ${CROSS} ${gymtype} skill is too low. ${this.number} needed, you have ${ns.nFormat(ns.getPlayer().skills[gymtype] / this.number, '0%')} of the way there`);
            }
        }
    }
}

// class Req???????????????? {
//     constructor(number) {
//         this.number = number;
//     }
//
//     /** @param {NS} ns **/
//     test(ns) {
//         return false; // TODO: ????????????????????????????????
//     }
//
//     /** @param {NS} ns **/
//     testFriendly(ns) {
//         if (this.test(ns)) {
//             ns.tprint(`* ${TICK} ??????????????`);
//         } else {
//             ns.tprint(`* ${CROSS} ????????????????)`
//         }
//     }
// }

function ReqFaction(ns, faction, requirements) {
    return function() {
        ns.tprint(`## ${faction}`);
        for (let req of requirements) {
            req.testFriendly(ns);
        }
    }
}

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    if (args.help) {
        ns.tprint('???????????????????????????????????????????????????????????');
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    const covenant = ReqFaction(ns, 'The Covenant', [
        new ReqAugumentations(30),
        new ReqMoney(75000000000),
        new ReqHackingSkill(850),
        new ReqAllCombatStats(850),
    ]);

    const caedalus = ReqFaction(ns, 'Daedalus', [
        new ReqAugumentations(30),
        new ReqMoney(100000000000),
        new ReqHackingSkill(2500),   // TODO: Requirement is hacking skill OR combat stats
        new ReqAllCombatStats(1500), // TODO: Requirement is hacking skill OR combat stats
    ]);

    const illuminati = ReqFaction(ns, 'Illuminati', [
        new ReqAugumentations(30),
        new ReqMoney(150000000000),
        new ReqHackingSkill(1500),
        new ReqAllCombatStats(1200),
    ]);

    covenant();
    caedalus();
    illuminati();
}
