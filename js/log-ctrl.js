function add_logs(transaction, operation, variable, value) {

	var txt_write = ''
	if (operation == 'write') {
		txt_write = `, ${value}`;
	}

	$('#logs').append(`<div class="item-log">
		${transaction}: ${operation}(${variable}${txt_write})
	</div>`);
}
