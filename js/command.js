$(function() {
	$('#new-command [name=operation]').change(function() {
		let lock_field = $(this).val() != 'write_item';
		$('#new-command [name=value]')
			.prop('disabled', lock_field)
			.closest('.box')
			.toggle(!lock_field);
	}).change();

	$('#new-command').submit(function(ev) {
		ev.preventDefault();
		let transaction = $('#new-command [name=transaction]').val();
		let operation = $('#new-command [name=operation]').val();
		let variable = $('#new-command [name=variable]').val();
		let value = $('#new-command [name=value]').val();

		let next = false;
		switch(operation) {
			case 'read_lock':
				next = read_lock(transaction, variable);
				break;
			case 'write_lock':
				next = write_lock(transaction, variable);
				break;
			case 'unlock':
				next = unlock(transaction, variable);
				break;
			case 'read_item':
				next = can_read(transaction, variable);
				break;
			case 'write_item':
				next = can_write(transaction, variable);
				if (next) {
					edit_memory(transaction,variable, value);
				}
				break;
		}
		if (next) {
			add_logs(transaction, operation, variable, value)
		}
	});

	reload_disk();
});
