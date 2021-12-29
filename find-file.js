
async function scanAndRun(ns, parent, server, asyncFunc) {
    const children = ns.scan(server);
    for (let child of children) {
        if (parent == child) {
            continue;
        }
        await asyncFunc(child);
        await scanAndRun(ns, server, child, asyncFunc);
    }
}

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([["help", false]]);
	const fileName = args._[0];
    if (args.help || !fileName) {
        ns.tprint("This searches all servers for a specific file.");
        ns.tprint(`Usage: run ${ns.getScriptName()} file-to-search-for`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} csec-test.msg`);
        return;
    }

    await scanAndRun(ns, '', 'home', async function(host) {
        let files = ns.ls(host, fileName);
        if (files.length > 0) {
            ns.tprint(`File found on '${host}'.`);
        }
    });
}
