/**
 * funcao para aguardar carregamento de todo o código para atribuir os eventos
 * e fazer as primeiras lógicas
 */
$(function() {
	/**
	 * funcao que pega o evento de mudanca de operacao e mostra os campos de
	 * acordo com o que sera executado
	 */
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

	/**
	 * funcao que pega o evento de execucao de um comando
	 * - trata as variaveis
	 * - chama funcao externa para operacao
	 */
	$('#new-command').submit(function(ev) {
		ev.preventDefault();
		let transaction = $('#new-command [name=transaction]').val();
		let operation = $('#new-command [name=operation]').val();
		let variable = $('#new-command [name=variable]').val();
		let value = $('#new-command [name=value]').val();

		run_command(transaction, operation, variable, value);
	});

	/**
	 * carrega dados persistentes no disco
	 */
	reload_disk();
	reload_log_disk();
});

/**
 * executa o comando enviado e faz todos os tratamentos usando as funcoes
 * dos controles
 */
function run_command(transaction, operation, variable, value) {
	let next = false;
	switch(operation) {
		case 'read_lock':
			next = has_transaction(transaction);
			if (next) {
				next = can_transaction(transaction, 'locking');
			}
			if (next) {
				next = read_lock(transaction, variable);
				if (!next) {
					wait_die(transaction, variable);
				}
			}
			break;

		case 'write_lock':
			next = has_transaction(transaction);
			if (next) {
				next = can_transaction(transaction, 'locking');
			}
			if (next) {
				next = write_lock(transaction, variable);
				if (!next) {
					wait_die(transaction, variable);
				}
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
			next = check_has_not_locking(transaction);
			if (next) {
				if (has_items_in_memory(transaction)) {
					change_transaction(transaction, 'finished');
				} else {
					next = end_transaction(transaction);
				}
			}
			break;

		case 'commit':
			next = has_transaction(transaction);
			if (next) {
				next = can_transaction(transaction, 'finished');
			}
			if (next) {
				commit_memory(transaction);
				end_transaction(transaction);
			}
			break;

		case 'abort':
			next = has_transaction(transaction);
			if (next) {
				transaction_unlock(transaction);
				delete_items_transaction_in_memory(transaction);
				end_transaction(transaction);
			}
			break;

		case 'abort_wait_die':
			next = has_transaction(transaction);
			if (next) {
				transaction_unlock(transaction);
				delete_items_transaction_in_memory(transaction);
				change_transaction(transaction, 'wait-die');
				operation = 'abort';
			}
			break;
	}
	if (next) {
		add_log_memory(transaction, operation, variable, value)
	}
	if (next && ['abort', 'commit'].indexOf(operation) != -1) {
		push_log_to_disk(transaction);
	}
}

/**
 * implementa regra wait-die: se a transação que solicitou o acesso é a
 * mais antiga, pode aguardar. Se for a mais nova, sofre rollback e recomeça
 * mais tarde com mesmo timestamp.
 * - pega todas as transacoes que estao bloqueando uma variavel
 * - verifica se tem alguma com mais prioridade (de acordo com o tempo) que a
 *   que solicitou o bloqueio
 * - se existir alguma, faz um tratamento rollback guardando o timestamp da
 *   trasacao
 */
function wait_die(transaction, variable) {
	let transactions = get_transsactions_locking(variable);
	let die = false;
	for(let i in transactions) {
		die = die || priority_transaction(transactions[i], transaction);
	}
	if (die) {
		run_command(transaction, 'abort_wait_die', null, null);
	}
}
