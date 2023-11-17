/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    if (args.help) {
        ns.tprint('???????????????????????????????????????????????????????????');
        ns.tprint(`USAGE: run ${ns.getScriptName()} [targetSkillLevel]`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    ns.disableLog('sleep');

    let targetSkillLevel = parseInt(args._[0] + '');
    if (!targetSkillLevel) {
        targetSkillLevel = 1500;
        ns.tprint(`Target skill level not specified, assuming ${targetSkillLevel}`);
    }

    // TODO: Determine this based on which city I am in
    let gymName = 'Powerhouse Gym';

    for (let gymtype in ns.enums.GymType) {
        let startedTraining = false;

        while (ns.getPlayer().skills[gymtype] < targetSkillLevel) {
            if (ns.singularity.isBusy()) {
                await ns.sleep(0.5 * 1000);
                continue;
            }

            let shouldFocus = true;
            let success = ns.singularity.gymWorkout(gymName, gymtype, shouldFocus);
            if (success) {
                startedTraining = true;
            } else {
                // TODO: ??????????????
                return;
            }
        }

        if (startedTraining)
            ns.singularity.stopAction();
    }
}
