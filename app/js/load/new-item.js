/**
 * For creating a <em>create new task</em> form.
 * @module new-item
 */

import * as markup from '../util/markup.js';
import * as rows from '../util/rows.js';

/**
 * Creates markup for a new row, representing one task
 * @param {string} type - either <code>"goal"</code> or <code>"routine"</code>
 */
export function type(type) {
	let table = document.getElementById(`${type}s`).querySelector('tbody');
	let row = table.insertRow(-1);
	markup.populateRow(row);
	rows.registerRow(row);
}

/**
 * Convenience method for {@link module:new-item.type type}.
 */
export function goal() {
    type('goal');
}

/**
* Convenience method for {@link module:new-item.type type}.
*/
export function routine() {
    type('routine');
}
