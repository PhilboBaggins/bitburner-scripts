import { threadsPossible, createTable } from './common.js'

function scriptType(script) {
    if (script.endsWith('.script')) {
        return 'NS1';
    } else if (script.endsWith('.js')) {
        return 'NS2';
    } else {
        return '???'
    }
}

/** @param {NS} ns **/
export async function main(ns) {
    const args = ns.flags([['help', false]]);
    if (args.help) {
        ns.tprint('????????????????????????????????????????????????????????????????????????');
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    const COL_WIDTH_NAME = 30;
    const COL_WIDTH_TYPE = 5;
    const COL_WIDTH_RAM = 10;
    const COL_WIDTH_THEADS = 20;
    const table = createTable(ns, [
        'Script'.padEnd(COL_WIDTH_NAME),
        'Type'.padStart(COL_WIDTH_TYPE),
        'RAM needed'.padStart(COL_WIDTH_RAM),
        'Threads possible'.padStart(COL_WIDTH_THEADS)
    ]);

    const scripts1 = ns.ls('home', '.script');
    const scripts2 = ns.ls('home', '.js');
    const scripts = scripts1.concat(scripts2);

    table.printHeader(ns);
    scripts.forEach(script => table.printRow(ns,
        script,
        scriptType(script),
        ('' + ns.getScriptRam(script).toFixed(2)),
        ('' + threadsPossible(ns, script, ns.getHostname()))
    ));
    table.printHeader(ns);
}
