
function add_log_disk(log) {

	let log_disk = JSON.parse(localStorage.getItem('log_disk') || '[]');

	log_disk.push(log);

	localStorage.setItem('log_disk', JSON.stringify(log_disk));

	reload_log_disk();
}

function reload_log_disk() {
	let view_logs = $('#logs-disk').empty();

	let log_disk = JSON.parse(localStorage.getItem('log_disk') || '{}');

	for (let i in log_disk) {
		view_logs.append(`<div class="item-log">
			${log_disk[i].value}
		</div>`);
	}

	let div = view_logs.parent();
	div.animate({scrollTop: div.prop('scrollHeight')}, 500);
}
