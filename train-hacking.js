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
        targetSkillLevel = 2500;
        ns.tprint(`Target skill level not specified, assuming ${targetSkillLevel}`);
    }

    // TODO: Determine this based on which city I am in
    let universityName = 'rothman university';

    const skillType = 'hacking';
    const courseName = 'Algorithms';

    let startedTraining = false;
    while (ns.getPlayer().skills[skillType] < targetSkillLevel) {
        if (ns.singularity.isBusy()) {
            await ns.sleep(0.5 * 1000);
            continue;
        }

        let shouldFocus = true;
        let success = ns.singularity.universityCourse(universityName, courseName, shouldFocus);
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
