function write_lock(transaction, variable) {
	let selector = $(`#lock tr[variable=${variable}]`);
	if (selector.length) {
		alert('A variável já possui um bloqueio');
		return false;
	}

	$('#lock').append(`<tr variable=${variable}>
		<td>${variable}</td>
		<td class="lock-type">WRITE</td>
		<td class="lock-qtd">-</td>
		<td class="lock-transactions">${transaction}</td>
	</tr>`);
	return true;
}

function read_lock(transaction, variable) {
	let selector = $(`#lock tr[variable=${variable}]`);

	// quando nao tem bloqueio
	if (!selector.length) {
		$('#lock').append(`<tr variable=${variable}>
			<td>${variable}</td>
			<td class="lock-type">READ</td>
			<td class="lock-qtd">1</td>
			<td class="lock-transactions">${transaction}</td>
		</tr>`);
		return true;
	}

	// quando ja possui um bloqueio de escrita
	if (selector.find('.lock-type').html() == 'WRITE') {
		alert('A variável já possui um bloqueio de escrita');
		return false;
	}

	// quando ja possui um bloqueio de leitura e eh da mesma transacao
	let lock_transactions = selector
		.find('.lock-transactions')
		.html()
		.split(', ');

	if (lock_transactions.indexOf(transaction) != -1) {
		alert('Essa transação já possui esse bloqueio');
		return false;
	}

	// adicionar minha transacao
	selector.find('.lock-transactions')
		.append(`, ${transaction}`);
	selector.find('.lock-qtd')
		.html(1+parseInt(selector.find('.lock-qtd').html()));

	return true;
}

function can_read(transaction, variable) {
	let selector = $(`#lock tr[variable=${variable}]`);
	if (!selector.length) {
		alert('A variável não está bloqueada');
		return false;
	}

	let lock_transactions = selector
		.find('.lock-transactions')
		.html()
		.split(', ');

	if (lock_transactions.indexOf(transaction) == -1) {
		alert('A transação não bloqueou a variável');
		return false;
	}

	return true;
}

function can_write(transaction, variable) {
	let selector = $(`#lock tr[variable=${variable}]`);
	if (!selector.length) {
		alert('A variável não está bloqueada');
		return false;
	}

	let lock_transactions = selector
		.find('.lock-transactions')
		.html()
		.split(', ');

	if (lock_transactions.indexOf(transaction) == -1) {
		alert('A transação não bloqueou a variável');
		return false;
	}

	let lock_type = selector.find('.lock-type').html();
	if (lock_type !== 'WRITE') {
		alert('A transação não bloqueou a variável para escrita');
		return false;
	}

	return true;
}

function unlock(transaction, variable) {
	let selector = $(`#lock tr[variable=${variable}]`);
	if (!selector.length) {
		alert('A variável não está bloqueada');
		return false;
	}

	let lock_transactions = selector
		.find('.lock-transactions')
		.html()
		.split(', ');

	if (lock_transactions.indexOf(transaction) == -1) {
		alert('Essa transação não bloqueou essa variável');
		return false;
	}

	lock_transactions = lock_transactions.filter(function(value, index, arr){
    return value != transaction;
  });

	selector
		.find('.lock-qtd')
		.html(lock_transactions.length);

  selector
		.find('.lock-transactions')
		.html(lock_transactions.join(', '));

	if (lock_transactions.length == 0) {
		selector.remove();
	}

	return true;
}

function check_has_not_locking(transaction) {
	let selector = $('#lock .lock-transactions');
	for (var i = 0; i < selector.length; i++) {
		let lock_transactions = selector.eq(i).html().split(', ');
		if (lock_transactions.indexOf(transaction) != -1) {
			alert(`A transacao ${transaction} possui bloqueios ativos`);
			return false;
		}
	}
	return true;
}
