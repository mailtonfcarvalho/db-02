function begin_transaction(transaction) {
	let selector = $(`#transaction tr[data=${transaction}]`);
	if (selector.length) {
		alert(`A transação ${transaction} já foi iniciada`);
		return false;
	}
	$('#transaction').append(
		`<tr data=${transaction}>
			<td>${transaction}</td>
			<td>${moment().format()}</td>
			<td class="state">locking</td>
		</tr>`
	);
	return true;
}

function change_transaction(transaction, state) {
	if (['locking', 'unlocking', 'finished'].indexOf(state) == -1) {
		alert(`Estado ${state} inválido`);
		return false
	}
	let selector = $(`#transaction tr[data=${transaction}]`);
	if (!selector.length) {
		alert(`A transação ${transaction} não foi iniciada`);
		return false;
	}
	selector.find('.state').html(state);
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
