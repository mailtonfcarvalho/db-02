function begin_transaction(transaction) {
	let selector = $(`#transaction tr[data=${transaction}]`);
	let timestamp = moment().format();

	if (selector.length) {
		if (selector.find('.state').html() == 'wait-die') {
			timestamp = selector.find('.timestamp').html();
			selector.remove();
		} else {
			alert(`A transação ${transaction} já foi iniciada`);
			return false;
		}
	}

	$('#transaction').append(
		`<tr data=${transaction}>
			<td>${transaction}</td>
			<td class="timestamp">${timestamp}</td>
			<td class="state">locking</td>
		</tr>`
	);
	return true;
}

function change_transaction(transaction, state) {
	if (['locking', 'unlocking', 'finished', 'wait-die'].indexOf(state) == -1) {
		alert(`Estado ${state} inválido`);
		return false
	}
	let selector = $(`#transaction tr[data=${transaction}]`);
	if (!selector.length) {
		alert(`A transação ${transaction} não foi iniciada`);
		return false;
	}
	selector
		.toggle(state != 'wait-die')
		.find('.state')
		.html(state);
	return true;
}

function end_transaction(transaction) {
	let selector = $(`#transaction tr[data=${transaction}]`);
	if (!selector.length) {
		alert(`A transação ${transaction} não foi iniciada`);
		return false;
	}
	selector.remove();
	return true;
}

function has_transaction(transaction) {
	let selector = $(`#transaction tr[data=${transaction}]`);
	if (!selector.length) {
		alert(`A transação ${transaction} não foi iniciada`);
		return false;
	}
	return true;
}

function can_transaction(transaction, state) {
	let selector = $(`#transaction tr[data=${transaction}]`);
	if (!selector.length) {
		alert(`A transação ${transaction} não foi iniciada`);
		return false;
	}
	let current_state = selector.find('.state').html();
	if (current_state !== state) {
		alert(`A transação ${transaction} está na fase de ${current_state}`);
		return false;
	}

	return true;
}

/**
 * Verifica se a transactionA tem prioridade sobre a transactionB
 * de acordo com o timestemp
 *
 * a prioridade é da transacao mais antiga, ou seja, timestemp menor
 */
function priority_transaction(transactionA, transactionB) {
	let timestampA = $(`#transaction tr[data=${transactionA}] .timestamp`).html();
	let timestampB = $(`#transaction tr[data=${transactionB}] .timestamp`).html();

	return timestampA < timestampB;
}
