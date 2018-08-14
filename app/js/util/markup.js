/** @module markup */
import post from './ajax.js';
import * as rows from './rows.js';
import * as forms from './forms.js';
import * as dates from './dates.js';
import * as state from '../state.js';
import * as create from '../create.js';
import * as load from '../load/index.js';

/**
 * Fills a table from the JSON response from a <code>list.php</code>.
 * @param {HTMLTableElement} table - <code>&lt;table&gt;</code> or <code>&lt;tbody&gt;</code>
 * @param {object[]} data - array of task data items
 */
export function populateTable(table, data) {
	// replace current <tbody> with new one
	let oldTbody = table.querySelector('tbody');
	let newTbody = document.createElement('tbody');

	for (let i=0; i<data.length; i++) {
		let row = newTbody.insertRow(-1);	// append row
		populateRow(row, data[i]);
		rows.registerRow(row);
	}
	table.replaceChild(newTbody, oldTbody);
}

/**
 * Fills the table row from JSON data from the server, or creates a new one.
 * @param {HTMLTableRowElement} row
 * @param {object} [item] - the JSON data to use when filling this row. If this argument is omitted, then a <em>new task</em> form will be created.
 */
export function populateRow(row, item) {
	let creating = !item;
	item = item || {	// default values:
		name: '', description: '', due_date: '', weight: 3, /*omit completed (we can only do this at the end)*/
	};
	// clear any existing cells
	while (row.children.length)
		row.deleteCell(0);

	for (let key in item) {
		if (item.hasOwnProperty(key)) {
			let cell = row.insertCell(-1);	// append cell
			populateCell(cell, key, item[key], creating);	// put <input/> in cell
		}
	}
	// focus first input
	let firstInput = row.children[0].querySelector('input');
	firstInput.focus();	// there is an <input> in each <td>

	if (!creating) {
		// put delete button on last cell (now key/value)
		let deleteButton = document.createElement('button');
		deleteButton.innerHTML = 'Delete';
		// IMO, this doesn't need a separate `delete.js`, we can do that if necessary though
		deleteButton.addEventListener('click', function() {
			if (confirm("Permantly delete this goal?")) {
				post(
					'app/ajax/goal/delete.php',	// TODO: replace 'goal' with the type
					{ name: row.querySelector('.name input').value }
				)
					.then(function(data) {
						load.list.goals();
					});
			}
		});
		row.insertCell(-1).appendChild(deleteButton);
	} else {
		row.className = 'create';	// change to $(row).addClass('create') ?
		let addButton = document.createElement('button');
		addButton.innerHTML = 'Add';
		addButton.className = 'add-task';
		addButton.addEventListener('click', function() {
			if (forms.validateRow(row)) {
				state.clearConfirmExitMessage();	// safe to leave page
				create.goal(
					row.querySelector('.name input').value,
					row.querySelector('.description input').value,
					row.querySelector('.due-date input').value,
					row.querySelector('.weight input').value
				)
					.then(function() {
						$('#start-goal').show();	// now user can create another goal
					});
			}
		});
		row.insertCell(-1).appendChild(addButton);

		let cancelButton = document.createElement('button');
		cancelButton.innerHTML = 'Cancel';	// TODO: replace these with images?
		cancelButton.className = 'cancel-task';
		cancelButton.addEventListener('click', function() {
			if (confirm('Cancel goal?')) {
				state.clearConfirmExitMessage();
				row.parentElement.deleteRow(-1);	// delete this row (last one)
				$('#start-goal').show();	// now user can create another goal
			}
		});
		row.insertCell(-1).appendChild(cancelButton);
	}
}

/**
 * Fills the table data cell from the key / value pair from the database.
 * @param {string} key - the column name
 * @param value - the column data
 */
function populateCell(cell, key, value, creating) {
	key = key.replace('_', '-');
	let input = document.createElement('input');
	switch (key) {
		case 'name': {
			input.type = 'text';
			input.placeholder = 'Get Discord';
			input.className = 'editable';
			break;
		}
		case 'description': {
			input.type = 'text';
			input.placeholder = 'Get the best social app, because it\s cool.';
			input.className = 'editable';
			break;
		}
		case 'due-date': {
			input.type = 'text';
			input.placeholder = dates.tomorrow();
			input.className = 'editable';
			break;
		}
		case 'weight': {
			input.type = 'range';
			input.className = 'editable';
			input.min = 1;
			input.max = 5;
			break;
		}
		case 'completed': {
			input.type = 'checkbox';
			input.className = 'editable';	// obviously not editable
			// force type conversion with ==, because value is a string (for whatever reason)
			if (value == 1)
				input.checked = true;
			else if (value === null)
				input.indeterminate = true;	// half check
			break;
		}
		default: {
			throw "Unhandled data key: '" + key + "'!";
		}
	}

	if (input.type !== 'checkbox') {
		if (!creating && input.type !== 'range') input.readOnly = true;
		input.value = value;
	}

	cell.className = key;
	if (key !== 'weight')
		cell.appendChild(input);
	else {
		// wrap range input with minimum and maximum values
		let min = document.createElement('span');
		min.innerHTML = input.min;
		cell.appendChild(min);

		cell.appendChild(input);

		let max = document.createElement('span');
		max.innerHTML = input.max;
		cell.appendChild(max);
	}
}
