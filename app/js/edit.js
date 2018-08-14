/**
 * For task editing.
 * @module
 */

import post from './util/ajax.js';
import * as rows from './util/rows.js';
import * as forms from './util/forms.js';
import * as state from './state.js';
import * as load from './load/index.js';

/*
 * Everything is dynamic here, because the tables will reload a lot, so use $(document).on
 */

/** the current input element that the user is editing */
let currentlyEditing = null;

function makeEditable(el) {
	if (el.type !== 'checkbox' && el.type !== 'range') el.readOnly = false;
	el.focus();
	el.lastValue = el.value;	// for if the user cancels the editing
	state.setConfirmExitMessage('Cancel edit?');
	currentlyEditing = el;
}

function makeReadonly(el) {
	if (el.type !== 'checkbox' && el.type !== 'range') el.readOnly = true;
	el.blur();
	if ( $(el).hasClass('invalid') )
		$(el).removeClass('invalid');
	state.clearConfirmExitMessage();	// safe to leave page
	currentlyEditing = null;
}

/**
 * Save an edited task input element.
 * @param {HTMLInputElement} input
 */
function updateTaskData(input) {
	let type = $(input).closest('table').prop('id').startsWith("goals") ? 'goal' : 'routine',
		key = input.parentElement.className,	// the table cell's `class` is the key
		value = input.type != 'checkbox' ? input.value : input.indeterminate ? null : input.checked,
		nameInput = $(input).closest('tr').find('input')[0],	// get input in first cell;
		// Use lastValue, if the name is the key that's being changed, so that the ajax call can find the right task!
		name = nameInput.value,
		originalName = key === 'name' ? nameInput.lastValue : nameInput.value;

	post(
		`app/ajax/${type}/edit.php`,
		{ name: originalName, key: key, value: value }
	)
		.then(function(data) {
			// doesn't seem to be necessary, but technically good for if the request failed
			// Use `name` not `originalName` because now the html `name` attribute is modified.
			load.item.type(type, name);
		});
}

export function init() {
	// add listener to datepicker select event, by modifying inputs when inserted into the DOM
	rows.addRowListener(function(row) {
		// don't modify creation row (see create.js)
		if (row.className === 'create') return;

		// there must be an input.date in the subhierarchy, so we'll assume it's there
		$(row).find('.due-date input').datepicker({
			minDate: 0,	// today
			onSelect: function() {
				makeReadonly(this);
				updateTaskData(this);
			}
		});
		// let user edit date input with only one click, because that's when the jQuery UI dialog shows
		$(row).find('.due-date input').click(function() {
			makeEditable(this);
		});

		// don't require user to press enter on slider to submit change; a simple click/drag/keystroke is enough
		$(row).find('input[type="range"]').on('input', function(event) {
			updateTaskData(this);
		});

		let completed = $(row).find('.completed input')[0];
		completed.wasChecked = completed.checked;
		completed.wasIndeterminate = completed.indeterminate;
		completed.addEventListener('input', function() {
			// use _was*_ because value on event fire is the value *after* click, which messes things up
			if (this.wasChecked && !this.wasIndeterminate)
				this.checked = false;
			else if (this.wasIndeterminate)
				this.checked = true;
			else
				this.indeterminate = true;

			this.wasChecked = this.checked;
			this.wasIndeterminate = this.indeterminate;
			updateTaskData(this);
		});
	});

	// Make data cells editable.
	$(document).on('dblclick', '#tasks input.editable:not([type="range"])', function() {
		makeEditable(this);
	});
	// Detect focus only by tab key.
	$(document).keyup(function(event) {	// https://stackoverflow.com/a/16145062/3783155
		var code = event.keyCode ? event.keyCode : event.which;
		if (code === 9 && $('#tasks tr:not(.create) input.editable:focus').length)
			makeEditable(event.target);
	});

	// lose focus (blur is fine for this, as there are no children)
	$(document).on('blur', '#tasks tr:not(.create) input.editable:not([readonly])', function(event) {
		// Treat as _escape_
		event.target.value = event.target.lastValue;	// cancel editing
		makeReadonly(event.target);
	});

	// check for _enter_ and _esc_
	$(document).on('keyup', "#tasks tr:not(.create) input.editable:not([readonly])", function(event) {
		var code = event.keyCode ? event.keyCode : event.which;
		if (code === 13) {
			// enter
			if (forms.validate(event.target)) {
				makeReadonly(event.target);
				updateTaskData(event.target);
			}

		}
		if (code === 27) {
			// escape
			event.target.value = event.target.lastValue;	// cancel editing
			makeReadonly(event.target);
		}
	});
}
