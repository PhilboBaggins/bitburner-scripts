import { scanAndRun } from './common.js'

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([["help", false]]);
	const fileName = args._[0];
    if (args.help || !fileName) {
        ns.tprint('This searches all servers for a specific file.');
        ns.tprint(`Usage: run ${ns.getScriptName()} file-to-search-for`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()} csec-test.msg`);
        return;
    }

    var numFound = 0;
    await scanAndRun(ns, async function(host) {
        let files = ns.ls(host, fileName);
        if (files.length > 0) {
            ns.tprint(`File found on '${host}'.`);
            numFound++;
        }
    });

    if (numFound == 0) {
        ns.tprint('File not found.');
    } else {
        ns.tprint('');
        ns.tprint(`File found on ${numFound} servers.`);
    }
}
