/**
 * @file For task editing
 */
$(document).ready(function() {
	/*
		Everything is dynamic here, because the tables will reload a lot, so use $(document).on
	*/
	var currentlyEditing = null;	// the current input element that the user is editing
	// Make data cells editable.
	$(document).on('dblclick', '#tasks input.editable', function() {
		makeEditable(this);
	});
	// Detect focus only by tab key.
	$(document).keyup(function(event) {	// https://stackoverflow.com/a/16145062/3783155
		var code = event.keyCode ? event.keyCode : event.which;
		if (code === 9 && $('#tasks input.editable:focus').length)
			makeEditable(event.target);
	});

	// lose focus (blur is fine for this, as there are no children)
	$(document).on('blur', '#tasks input.editable:not([readonly])', function(event) {
		// Treat as _escape_
		event.target.value = event.target.lastValue;	// cancel editing
		makeReadonly(event.target);
	});

	// check for _enter_ and _esc_
	$(document).on('keyup', "#tasks input.editable:not([readonly])", function(event) {
		var code = event.keyCode ? event.keyCode : event.which;
		if (code === 13) {
			// enter
			makeReadonly(event.target);
			updateTaskData(event.target);

		}
		if (code === 27) {
			// escape
			event.target.value = event.target.lastValue;	// cancel editing
			makeReadonly(event.target);
		}
	});

	// listen to datepicker select event, by modifying inputs when inserted into the DOM
	let targetNodes = $('#tasks table'),
		config = { childList: true },
		observer = new MutationObserver(function(mutationsList) {
			for (let mutation of mutationsList) {
				if (mutation.addedNodes.length !== 1)
					throw "Number of added nodes is not 1!";
				let tbody = mutation.addedNodes[0];
				for (let i=0; i<tbody.childNodes.length; i++) {
					let row = tbody.childNodes[i];
					// don't modify creation row (see create.js)
					if (row.className === 'create') continue;

					// there must be an input.date in the subhierarchy, so we'll assume it's there
					$(row).find('input.due-date').datepicker({
						minDate: 0,	// today
						onSelect: function() {
		/* wow */			makeReadonly(this);
							updateTaskData(this);
						}
					});

					let completed = $(row).find('input.completed')[0];
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
				}
			}
		});	// only watch for children hierarchy being changed
	for (let i=0; i<targetNodes.length; i++) {
		observer.observe(targetNodes[i], config);
	}

	function makeEditable(el) {
		el.readOnly = false;
		el.focus();
		el.lastValue = el.value;	// for if the user cancels the editing
		currentlyEditing = el;
	}

	function makeReadonly(el) {
		el.readOnly = true;
		el.blur();
		currentlyEditing = null;
	}

	/**
	 * Save an edited task input element.
	 * @param {HTMLInputElement} input
	 */
	function updateTaskData(input) {
		let type = $(input).closest('table').prop('id').startsWith("goals") ? 'goal' : 'routine',
			key = input.className.split(' ')[1],	// count on second class being the pseudo-column-name for now
			value = input.type != 'checkbox' ? input.value : input.indeterminate ? null : input.checked,
			nameInput = $(input).closest('tr').find('input')[0],	// get input in first cell;
			// Use lastValue, if the name is the key that's being changed, so that the ajax call can find the right task!
			originalName = key === 'name' ? $(nameInput).lastValue : nameInput.value;
		$.post(
			'app/ajax/'+type+'/edit.php',
			{ name: originalName, key: key, value: value }
		)
			.done(function(data) {

				Refresh.refresh(type);	// doesn't seem to be necessary, but technically good for if the request failed.
			})
			.fail(function(xhr, status, error) {
				throw 'Error updating '+type+': ' + error;
			});
	}
});
