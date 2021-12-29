function listFiles(ns, title, files) {
	ns.tprint('## ' + title);
	if (files.length == 0) {
		ns.tprint('* None');
	} else {
		for (const file of files) {
			ns.tprint(`* ${file}`);
		}
	}
	ns.tprint('');
}

function listDifference(list1, list2) {
	return list1.filter(item => list2.indexOf(item) == -1);
}

/** @param {NS} ns **/
export async function main(ns) {
	let scripts1 = ns.ls('home', '.script');
	let scripts2 = ns.ls('home', '.js');
	let executables = ns.ls('home', '.exe');
	let messages = ns.ls('home', '.msg');

	var other = ns.ls('home');
	other = listDifference(other, scripts1)
	other = listDifference(other, scripts2)
	other = listDifference(other, executables)
	other = listDifference(other, messages);

	listFiles(ns, 'NS1 scripts', scripts1);
	listFiles(ns, 'NS2 scripts', scripts2);
	listFiles(ns, 'Executables', executables);
	listFiles(ns, 'Messages', messages);
	listFiles(ns, 'Other', other);
}
