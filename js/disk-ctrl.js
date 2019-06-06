function edit_disk(variable, value) {
	let disk = JSON.parse(localStorage.getItem('disk') || '{}');
	disk[variable] = value;
	localStorage.setItem('disk', JSON.stringify(disk));

	reload_disk();
	return true;
}

function reload_disk() {
	let disk = JSON.parse(localStorage.getItem('disk') || '{}');
	let html_disk = $('#disk').empty();
	for (let i in disk) {
		html_disk.append(
			`<tr><td>${i}</td><td>${disk[i]}</td></tr>`
		)
	}
	return true;
}

