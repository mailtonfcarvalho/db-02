function edit_memory(transaction, variable, value) {
	let selector = $(`#memory tr[data=${variable}]`);
	if (selector.length) {
		selector.find('.memory-value').html(value);
	} else {
		$('#memory').append(`<tr data=${variable} data-transaction=${transaction}><td>${transaction}</td><td>${variable}</td><td class="memory-value">${value}</td></tr>`);
	}
}

function delete_memory(variable) {
	$(`#memory tr[data=${variable}]`).remove();
}

function delete_items_transaction_in_memory(transaction) {
	$(`#memory tr[data-transaction=${transaction}]`).remove();
}

function has_items_in_memory(transaction) {
	return $(`#memory tr[data-transaction=${transaction}]`).length > 0;
}

function commit_memory(transaction) {
	let selector = $(`#memory tr[data-transaction=${transaction}]`);
	for (var i = 0; i < selector.length; i++) {
		let variable = selector.eq(i).attr('data');
		let value = selector.eq(i).find('.memory-value').html();
		edit_disk(variable, value);
		delete_memory(variable);
	}
}
