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

    ns.disableLog('sleep');

    // TODO: Get from command line aguemnts
    let targetSkillLevel = 1500;

    // TODO: Determine this based on which city I am in
    let gymName = 'Powerhouse Gym';

    for (let gymtype in ns.enums.GymType) {
        while (ns.getPlayer().skills[gymtype] < targetSkillLevel) {
            if (ns.singularity.isBusy()) {
                await ns.sleep(0.5 * 1000);
                continue;
            }

            let shouldFocus = true;
            let success = ns.singularity.gymWorkout(gymName, gymtype, shouldFocus);
            if (!success) {
                // TODO: ??????????????
                return;
            }
        }

        ns.singularity.stopAction();
    }
}
