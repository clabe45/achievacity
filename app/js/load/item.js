/**
 * For loading a single task.
 * @module item
 */

import ajax from '../util/ajax.js';
import * as markup from '../util/markup.js';
import * as rows from '../util/rows.js';

/**
 * Reloads an existing row, representing one task.
 * @param {string} type - Either <code>"goal"</code> or <code>"routine"</code>.
 * @param {string} name - The task's value in the <code>name</code> column.
 */
export function type(type, name) {
	let table = document.getElementById(type+'s').querySelector('tbody');
	let rowIndex = -1;
	for (let i=0; i<table.children.length; i++) {
		if (table.children[i].querySelector('.name input').value === name)
			rowIndex = i;
	}
	if (rowIndex < 0) throw "Couldn't find row with name '"+name+"'";

	post(
		'app/ajax/'+type+'/item.php',	// called from root
		{ 'name': name }
	)
		.then(function(item) {
			// remove and re-add row, to trigger util.js tbody MutationObserver
			table.deleteRow(rowIndex);
			let row = table.insertRow(rowIndex);

			markup.populateRow(row, item);
			rows.registerRow(row);
		});
}

/**
 * Convenience method for {@link module:item.type type}.
 * @param {string} name - The task's value in the <code>name</code> column.
 */
export function goal(name) {
    type('goal', name);
}

/**
* Convenience method for {@link module:item.type type}.
* @param {string} name - The task's value in the <code>name</code> column.
*/
export function routine(name) {
    type('routine', name);
}
