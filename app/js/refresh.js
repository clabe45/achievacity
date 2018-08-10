/**
 * @namespace Refresh for adding content to the `<table>`s; moslty for reloading data from the server
 * Used in other app scripts and in this file
 * TODO: on hover over description, show tooltip of full text
 */
let Refresh = (function() {
	/**
	 * Reloads tasks from the database into the tables

	 */
	function list(type) {
		Util.post(`app/ajax/${type}/list.php`)	// called from root
			.then(function(data) {
				let table = document.getElementById(type+'s-table');	// I like to use pure JavaScript when I can!
				populateTable(table, data);
			});
	}

	/**
	 * @private Fills a table from the JSON response from a list.php
	 * @param {HTMLTableElement} table - <code>&lt;table&gt;</code> or <code>&lt;tbody&gt;</code>
	 * @param {object[]} data - array of task data items
	 */
	function populateTable(table, data) {
		// replace current <tbody> with new one
		let oldTbody = table.querySelector('tbody');
		let newTbody = document.createElement('tbody');

		for (let i=0; i<data.length; i++) {
			let row = newTbody.insertRow(-1);	// append row
			populateRow(row, data[i]);
			Util.registerRow(row);
		}
		table.replaceChild(newTbody, oldTbody);
	}

	/**
	 * @private Reloads an existing row, representing one task
	 * @param {string} type - either <code>"goal"</code> or <code>"routine"</code>
	 * @param {string} name - the task's `name`
	 */
	function item(type, name) {
		let table = document.getElementById(type+'s').querySelector('tbody');
		let rowIndex = -1;
		for (let i=0; i<table.children.length; i++) {
			if (table.children[i].querySelector('.name input').value === name)
				rowIndex = i;
		}
		if (rowIndex < 0) throw "Couldn't find row with name '"+name+"'";

		Util.post(
			'app/ajax/'+type+'/item.php',
			{ 'name': name }
		)	// called from root
			.then(function(item) {
				// remove and re-add row, to trigger util.js tbody MutationObserver
				table.deleteRow(rowIndex);
				let row = table.insertRow(rowIndex);

				populateRow(row, item);
				Util.registerRow(row);
			});
	}

	/**
	 * @private Creates markup for a new row, representing one task
	 * @param {string} type - either <code>"goal"</code> or <code>"routine"</code>
	 */
	function newItem(type) {
		let table = document.getElementById(type+'s').querySelector('tbody');
		let row = table.insertRow(-1);
		populateRow(row);
		Util.registerRow(row);
	}

	/**
	 * @private Fills the table row from JSON data from the server, or creates a new one
	 * @param {HTMLTableRowElement} row
	 * @param {object} [item] - the JSON data to use when filling this row. If this argument is omitted, then a <em>new task</em> form will be created.
	 */
	function populateRow(row, item) {
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
			// TODO: add confirmation message
			deleteButton.addEventListener('click', function() {
				Util.post(
					'app/ajax/goal/delete.php',
					{ name: row.querySelector('.name input').value }
				)
					.then(function(data) {
						Refresh.list.goals();
						// TODO
					})
					.catch(function(xhr, status, error) {
						// TODO
					});
			});
			row.insertCell(-1).appendChild(deleteButton);
		} else {
			row.className = 'create';	// change to $(row).addClass('create') ?
			let addButton = document.createElement('button');
			addButton.innerHTML = 'Add';
			addButton.className = 'add-task';
			addButton.addEventListener('click', function() {
				// TODO: Util.Util.validate and display error(s) if necessary
				if (Util.validateRow(row))
					Create.goal(
						row.querySelector('.name input').value,
						row.querySelector('.description input').value,
						row.querySelector('.due-date input').value,
						row.querySelector('.weight input').value
					);
			});
			row.insertCell(-1).appendChild(addButton);

			let cancelButton = document.createElement('button');
			cancelButton.innerHTML = 'Cancel';	// TODO: replace these with images?
			cancelButton.className = 'cancel-task';
			cancelButton.addEventListener('click', function() {
				row.parentElement.deleteRow(-1);	// delete this row (last one)
			});
			row.insertCell(-1).appendChild(cancelButton);
		}
	}

	/**
	 * @private Fills the table data cell from the key value pair from the database
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
				input.placeholder = Util.tomorrow();
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

	return {
		list: {
			goals: function() { list('goal'); },
			routines: function() { list('routine'); },
			type: list
		},
		item: {
			goal: function() { item('goal'); },
			routine: function() { item('routine'); },
			type: item
		},
		newItem: {
			goal: function() { newItem('goal'); },
			routine: function() { newItem('routine'); },
			type: newItem
		}
	};
})();

// inital load
$(document).ready(function() {
	Refresh.list.goals();
	// Refresh.list.routines();
})
