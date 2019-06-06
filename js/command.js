$(function() {
	$('#new-command [name=operation]').change(function() {
		let lock_field = $(this).val() != 'write_item';

		$('#new-command [name=value]')
			.prop('disabled', lock_field)
			.closest('.box')
			.toggle(!lock_field);


		lock_field = [
			'begin_transaction',
			'commit',
			'abort',
			'end_transaction',
		].indexOf($(this).val()) != -1;

		$('#new-command [name=variable]')
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
				next = has_transaction(transaction);
				if (next) {
					next = can_transaction(transaction, 'locking');
				}
				if (next) {
					next = read_lock(transaction, variable);
				}
				break;

			case 'write_lock':
				next = has_transaction(transaction);
				if (next) {
					next = can_transaction(transaction, 'locking');
				}
				if (next) {
					next = write_lock(transaction, variable);
				}
				break;

			case 'unlock':
				next = has_transaction(transaction);
				if (next) {
					change_transaction(transaction, 'unlocking');
					next = unlock(transaction, variable);
				}
				break;

			case 'read_item':
				next = has_transaction(transaction);
				if (next) {
					next = can_read(transaction, variable);
				}
				break;

			case 'write_item':
				next = has_transaction(transaction);
				if (next) {
					next = can_write(transaction, variable);
				}
				if (next) {
					edit_memory(transaction,variable, value);
				}
				break;

			case 'begin_transaction':
				next = begin_transaction(transaction);
				break;

			case 'end_transaction':
				// verificar se a transacao tem bloqueio ativo... [implementar]
				next = end_transaction(transaction);
				break;

			case 'commit':
				// verifica se existe transacao
				// verifica estado da transacao
				// passar dados para o disco
				break;

			case 'abort':
				// verifica se existe transacao
				// apaga tudo da transacao do locking table
				// apaga tudo da transacao na memoria
				// apaga a transacao
				break;
		}
		if (next) {
			add_logs(transaction, operation, variable, value)
		}
	});

	reload_disk();
});
