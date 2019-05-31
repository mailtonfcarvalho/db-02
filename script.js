
function edit_memory(variable, value) {
	let selector = $(`#memory tr[data=${variable}]`);
	if (selector.length) {
		selector.find('.memory-value').html(value);
	} else {
		$('#memory').append(`<tr data=${variable}><td>${variable}</td><td class="memory-value">${value}</td></tr>`);
	}
}

function delete_memory(variable) {
	$(`#memory tr[data=${variable}]`).remove();
}

function add_logs(log) {

	var txt_write = ''
	if (log.commad == 'write') {
		txt_write = `, ${log.value}`;
	}

	$('#logs').append(`<div class="item-log">
		${log.transaction}: ${log.commad}(${log.variable}${txt_write})
	</div>`);
}

// funcoes de bloqueios
function write_lock(transaction, variable) {
	let selector = $(`#lock tr[variable=${variable}]`);
	if (selector.length) {
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
		return false;
	}

	// quando ja possui um bloqueio de leitura e eh da mesma transacao
	let lock_transactions = selector
		.find('.lock-transactions')
		.html()
		.split(', ');

	if (lock_transactions.indexOf(transaction) != -1) {
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
		return false;
	}

	let lock_transactions = selector
		.find('.lock-transactions')
		.html()
		.split(', ');

	if (lock_transactions.indexOf(transaction) == -1) {
		return false;
	}

	return true;
}

function can_write(transaction, variable) {
	let selector = $(`#lock tr[variable=${variable}]`);
	if (!selector.length) {
		return false;
	}

	let lock_type = selector.find('.lock-type').html();
	if (lock_type !== 'WRITE') {
		return false;
	}

	let lock_transactions = selector
		.find('.lock-transactions')
		.html()
		.split(', ');

	if (lock_transactions.indexOf(transaction) == -1) {
		return false;
	}

	return true;
}

function unlock(transaction, variable) {
	let selector = $(`#lock tr[variable=${variable}]`);
	if (!selector.length) {
		return false;
	}

	let lock_transactions = selector
		.find('.lock-transactions')
		.html()
		.split(', ');

	if (lock_transactions.indexOf(transaction) == -1) {
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

