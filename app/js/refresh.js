/**
 * @namespace Refresh for refreshing the data tables
 * used in other app scripts and in this file
 * TODO: make per-item functions, along with the global functions
 */
let Refresh = (function() {
	/**
	 * Reloads tasks from the database into the tables
	 */
	function refresh(type) {
		$.post('app/ajax/'+type+'/list.php')	// called from root
			.done(function(data) {
				let table = document.getElementById(type+'s-table');	// I like to use pure JavaScript when I can!
				populateTable(table, data);
			})
			.fail(function(xhr, status, error) {
				throw 'Error refreshing '+type+'s: ' + error;
			});
	}

	/**
	 * @private Fills a table from the JSON response from a list.php
	 */
	function populateTable(table, data) {
		// clear all previous data rows
		for (let i=1; i<table.rows.length; i++)
			table.deleteRow(1);	// 1 header row

		for (let i=0; i<data.length; i++) {
			let row = table.insertRow(-1);	// append row
			populateRow(row, data[i]);
		}
	}

	/**
	 * @private Fills the table row from the JSON response item from a list.php
	 */
	function populateRow(row, item) {
		for (let key in item) {
			if (item.hasOwnProperty(key)) {
				let cell = row.insertCell(-1);	// append cell
				populateCell(cell, key, item[key]);	// put <input/> in cell
			}
		}
		// put delete button on last cell (now key/value)
		let deleteButton = document.createElement('button');
		deleteButton.innerHTML = 'Delete';
		// IMO, this doesn't need a separate `delete.js`, we can change this if necessary
		deleteButton.addEventListener('click', function() {
			$.post(
				'app/ajax/goal/delete.php',
				{ name: row.querySelector('input.name').value }
			)
				.done(function(data) {
					Refresh.goals();
					// TODO
				})
				.fail(function(xhr, status, error) {
					// TODO
				});
		});
		row.insertCell(-1).appendChild(deleteButton);
	}

	/**
	 * @private Fills the table data cell from the key value pair from the database
	 * @param key the column name
	 * @param key the column data
	 */
	function populateCell(cell, key, value) {
		let input = document.createElement('input');
		switch (key) {
			case 'name': {
				input.type = 'text';
				input.className = 'editable name';
				break;
			}
			case 'description': {
				input.type = 'text';
				input.className = 'editable description';
				break;
			}
			case 'due_date': {
				input.type = 'text';
				input.className = 'editable due-date';
				// value = new Date(value).toISOString();
				break;
			}
			case 'weight': {
				input.type = 'number';
				input.className = 'editable weight';
				input.min = 1;
				input.max = 5;
				break;
			}
			case 'completed': {
				input.type = 'checkbox';
				input.className = 'editable completed';	// obviously not editable
				// force type conversion, because value is a string (for whatever reason)
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
			input.readOnly = true;
			input.value = value;
		}

		cell.appendChild(input);
	}

	return {
		refresh: refresh,
		goals: function() { refresh('goal'); },
		routines: function() { refresh('routine'); }
	};
})();

// inital load
$(document).ready(function(e) {
	Refresh.goals();
	// Refresh.routines();
})
