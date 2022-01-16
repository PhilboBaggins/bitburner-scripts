
function scriptType(script) {
    if (script.endsWith('.script')) {
        return 'NS1';
    } else if (script.endsWith('.js')) {
        return 'NS2';
    } else {
        return '???'
    }
}

function threadsPossible(ns, script) {
    let hostname = ns.getHostname();
    return '' + Math.floor((ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname)) / ns.getScriptRam(script));
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

    let COL_WIDTH_NAME = 30;
    let COL_WIDTH_TYPE = 5;
    let COL_WIDTH_RAM = 20;
    let COL_WIDTH_THEADS = 20;

    let scripts1 = ns.ls('home', '.script');
    let scripts2 = ns.ls('home', '.js');
    let scripts = scripts1.concat(scripts2);

    ns.tprint('-'.padStart(80, '-'));
    ns.tprint(
        'Script'.padEnd(COL_WIDTH_NAME),
        'Type'.padStart(COL_WIDTH_TYPE),
        'RAM needed'.padStart(COL_WIDTH_RAM),
        'Threads possible'.padStart(COL_WIDTH_THEADS),
    );

    ns.tprint('-'.padStart(80, '-'));

    scripts.forEach(script => ns.tprint(
        script.padEnd(COL_WIDTH_NAME),
        scriptType(script).padStart(COL_WIDTH_TYPE),
        ('' + ns.getScriptRam(script).toFixed(2)).padStart(COL_WIDTH_RAM),
        threadsPossible(ns, script).padStart(COL_WIDTH_THEADS)
    ));
}
