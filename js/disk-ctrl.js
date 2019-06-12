/**
 * modifica variavel no disco
 * - salva direto na persistencia
 * - chama funcao de recarregar
 */
function edit_disk(variable, value) {
	let disk = JSON.parse(localStorage.getItem('disk') || '{}');
	disk[variable] = value;
	localStorage.setItem('disk', JSON.stringify(disk));

	reload_disk();
	return true;
}
/**
 * Deleta todos os dados na persistencia
 */
function delete_disk() {
	localStorage.removeItem('disk');
	localStorage.removeItem('log_disk');
	reload_disk();
	reload_log_disk();
	return true;
}
/**
 * recarrega a exibição de acordo com o que ta na persistencia
 */
function reload_disk() {
	let disk = JSON.parse(localStorage.getItem('disk') || '{}');
	let html_disk = $('#disk').empty();
	for (let i in disk) {
		html_disk.append(
			`<tr><td>${i}</td><td>${disk[i]}</td></tr>`
		)
	}
	return true;
}
