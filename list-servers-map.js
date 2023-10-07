import { scanAndRun } from 'common.js'

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    if (args.help) {
        ns.tprint('Find all servers and print out a graphviz map of them.');
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    var graphvizCode = '\ngraph {\n';
    await scanAndRun(ns, async function(host) {
        const children = ns.scan(host);
        for (let child of children) {
            if (parent != child) {
                graphvizCode += `    \"${host}\" -- \"${child}\";\n`;
            }
        }
    });
    graphvizCode += '}';
    ns.tprint(graphvizCode);
}
