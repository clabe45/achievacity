/**
* For reloading data from the server and generating forms.
* @module
*/

/*
 * TODO: On hover over description, show tooltip of full text.
 */

import * as list from './list.js';
import * as item from './item.js';
import * as newItem from './new-item.js';

export { list, item, newItem };

export function init() {
	// inital load
	$(document).ready(function() {
		list.goals();
		// TODO [when available]: list.routines();
	});
}
