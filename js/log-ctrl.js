/**
 * adiciona um log na view de logs
 * - faz tratamento para saber quando mostrar variable e value
 */
function add_logs(transaction, operation, variable, value) {

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


	$('#logs').append(`<div class="item-log">
		${transaction}: ${operation}(${txt_write})
	</div>`);
}
