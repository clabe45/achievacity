/**
 * For task creation.
 * @module create
 */

import post from './util/ajax.js';
import * as rows from './util/rows.js';
import * as forms from './util/forms.js';
import * as state from './state.js';
import * as load from './load/index.js';

/**
 * Inserts a new goal with the specified column values into the database.
 * @param {string} name
 * @param {string} description
 * @param {string} dueDate - The due date in <code>MM/DD/YYYY</code> format.
 * @param {number} weight
 * @return {Promise}
 */
export function goal(name, description, dueDate, weight) {
	// this is weird because it's a promise within a promise, but I think it's ok
	return new Promise(function(resolve, reject) {
		post(
			'app/ajax/goal/create.php',		// called from root
			{ 'name': name, 'description': description, 'due-date': dueDate, 'weight': weight }
		)
			.then(function() {
				load.list.goals();
				resolve();
			})
			.catch(function(error) {
				reject(error);
			});
	});
}

export function init() {
	rows.addRowListener(function(row) {
		// only modify creation row (see create.js)
		if (row.className !== 'create') return;

		for (let j=0; j<row.children.length; j++) {
			let cell = row.children[j],
				input = cell.querySelector('input');
			if (!input) continue;	// probably a button in cell, so no need to handle it
			// Don't bind *enter* and *escape* keys to datepicker for submitting item; that's ambiguous.
			if (!cell.className.includes('due-date')) {
				input.addEventListener('keyup', function(event) {
					forms.detectEnterCancel(event, row.querySelector('.add-task'), row.querySelector('.cancel-task'));
				});
			} else $(input).datepicker({ minDate: /*today*/0 });
		}
	});

	$(document).ready(function() {
		$('#start-goal').click(function() {
			state.setConfirmExitMessage('Lose unsaved task?');
			load.newItem.goal();
			$(this).hide();	// don't let users start creating two goals at once
		});
	});
}
