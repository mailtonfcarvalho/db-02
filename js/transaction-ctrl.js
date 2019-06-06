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
			<td class="state">blocking</td>
		</tr>`
	);
	return true;
}

function change_transaction(transaction, state) {
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
