/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    if (args.help || args._.length < 1) {
        ns.tprint('Run arbitary functions in the \`ns\` interface');
		ns.tprint(`Usage: run ${ns.getScriptName()} function [arguments]`);
		ns.tprint('Example:');
		ns.tprint(`> run ${ns.getScriptName()} tprint "hello world"`);
        return;
    }

	const func = args._[0];
	const funcArgs = args._.slice(1);

    ns[func](...funcArgs);
}
