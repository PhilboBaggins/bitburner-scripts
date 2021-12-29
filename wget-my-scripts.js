
const PHILBO_BAGGINS_REPO_BASE_URL = 'https://raw.githubusercontent.com/PhilboBaggins/bitburner-scripts/main/';

async function wgetScript(ns, baseURL, fileName) {
    let url = baseURL + fileName;
    ns.tprint(`Downloading ${url}`);
    await ns.wget(url, fileName);
}

/** @param {NS} ns **/
export async function main(ns) {
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'auto-root.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'deploy-to-all.js');
    //await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'find-file.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'hack-self.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'll.js');
    //await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'max-grow.js');
    //await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'max-hack.js');
    //await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'max-weaken.js');
    //await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'ns.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'stock-grow.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'stock-weaken.js');
    await wgetScript(ns, PHILBO_BAGGINS_REPO_BASE_URL, 'wget-my-scripts.js'); // This script
}
