
const PHILBO_BAGGINS_REPO_BASE_URL = 'https://raw.githubusercontent.com/PhilboBaggins/bitburner-scripts/main/';

async function wgetScript(ns, baseURL, fileName) {
    let url = baseURL + fileName;
    ns.tprint(`Downloading ${url}`);
    await ns.wget(url, fileName);
}

/** @param {NS} ns **/
export async function main(ns) {
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, '1001.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'auto-root.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'deploy-to-all.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'find-file.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'hack-self.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'just-grow.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'just-hack.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'just-weaken.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'killall-everywhere.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'list-servers.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'll.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'max-grow.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'max-hack.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'max-script.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'max-weaken.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'ns.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'script-info.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'stock-auto-sell.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'stock-grow.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'stock-position.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'stock-weaken.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'wget-my-scripts.js'); // This script
}
