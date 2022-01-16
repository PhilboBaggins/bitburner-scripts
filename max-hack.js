/** @param {NS} ns **/
export async function main(ns) {
    let childScriptArgs = ['just-hack.js'].concat(ns.args);
    ns.exec('max-script.js', ns.getHostname(), 1, ...childScriptArgs);
}
