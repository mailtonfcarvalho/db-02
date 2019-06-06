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

function has_items_in_memory(transaction) {
	return $(`#memory tr[data-transaction=${transaction}]`).length > 0;
}
