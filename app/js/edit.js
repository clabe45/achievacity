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
		event.target.value = $(event.target).data('last-value');	// cancel editing
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
			event.target.value = $(event.target).data('last-value');	// cancel editing
			makeReadonly(event.target);
		}
	});

	// listen to datepicker select event, by modifying inputs when inserted into the DOM
	let targetNodes = $('#tasks tbody'),
		config = { childList: true },
		observer = new MutationObserver(function(mutationsList) {
			for (let mutation of mutationsList) {
				for (let i=0; i<mutation.addedNodes.length; i++) {
					// there must be an input.date in the subhierarchy, so we'll assume it's there
					$( $(mutation.addedNodes[i]).find('input.due-date') ).datepicker({
						minDate: 0,	// today
						onSelect: function() {
		/* wow */			makeReadonly(this);
							updateTaskData(this);
						}
					})
				}
			}
		});	// only watch for children hierarchy being changed
	for (let i=0; i<targetNodes.length; i++) {
		observer.observe(targetNodes[i], config);
	}

	// listen to checkbox change event
	$(document).on('change', '#tasks input[type="checkbox"]', function(event) {
		updateTaskData(event.target);
	});

	function makeEditable(el) {
		el.readOnly = false;
		el.focus();
		$(el).data('last-value', el.value);	// for if the user cancels the editing
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
			value = input.type != 'checkbox' ? input.value : input.checked,
			nameInput = $(input).closest('tr').find('input')[0],	// get input in first cell;
			// Use 'last-value', if the name is the key that's being changed, so that the ajax call can find the right task!
			originalName = key === 'name' ? $(nameInput).data('last-value') : nameInput.value;
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
