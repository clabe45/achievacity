/**
 * For loading an entire table of tasks.
 * @module list
 */

import post from '../util/ajax.js';
import * as markup from '../util/markup.js';

/**
 * Reloads tasks from the database into the tables
 * @param {string} type - either <code>"goal"</code> or <code>"routine"</code>
 */
export function type(type) {
	post(`app/ajax/${type}/list.php`)	// called from root
		.then(function(data) {
			let table = document.getElementById(`${type}s-table`);	// I like to use pure JavaScript when I can!
			markup.populateTable(table, data);
		});
}

/**
 * Convenience method for {@link module:list.type type}.
 */
export function goals() {
    type('goal');
}

/**
* Convenience method for {@link module:list.type type}.
*/
export function routines() {
    type('routine');
}
