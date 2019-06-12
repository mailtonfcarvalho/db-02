/**
 * adiciona um log na view de logs
 * - faz tratamento para saber quando mostrar variable e value
 */
let list_logs_memory = [];

function add_log_memory(transaction, operation, variable, value) {

	var txt_write = [
		'begin_transaction',
		'commit',
		'abort',
		'end_transaction',
		'rollback',
	].indexOf(operation) == -1 ? variable : '';


	if (operation == 'write_item') {
		txt_write += `, ${value}`;
	}

	list_logs_memory.push({
		transaction: transaction,
		value: `${transaction}: ${operation}(${txt_write})`,
	});

	reload_log_memory();
}

function reload_log_memory() {
	let view_logs = $('#logs').empty();

	for (let i in list_logs_memory) {
		view_logs.append(`<div class="item-log">
			${list_logs_memory[i].value}
		</div>`);
	}
}

function push_log_to_disk(transaction) {
	for (let i in list_logs_memory) {
		if (list_logs_memory[i].transaction == transaction) {
			add_log_memory(list_logs_memory[i]); // coloca no log do disco
			list_logs_memory.splice(i, 1); // remove do log da memoria
		}
	}
}
