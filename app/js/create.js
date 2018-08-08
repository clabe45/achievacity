/**
 * @file For task creation
 * TODO: Only allow one creation row at a time.
 * TODO: in this file and in edit.js, don't detect ENTER and ESC when datepicker is opened?
 */
var Create = (function() {
	$(document).on('click', '#start-goal', function() {
		Refresh.newItem.goal();
	});

	function createGoal(name, description, dueDate, weight) {
		$.post(
			'app/ajax/goal/create.php',		// called from root
			{ 'name': name, 'description': description, 'due-date': dueDate, 'weight': weight }
		)
			.done(function(data) {
				// TODO: Display message here
				Refresh.list.goals();
			})
			.fail(function(xhr, status, error) {
				throw 'Error creating goal: ' + error;
			});

	}

	return {
		goal: createGoal
	};
})();

Util.addRowListener(function(row) {
	// only modify creation row (see create.js)
	if (row.className !== 'create') return;

	for (let j=0; j<row.children.length; j++) {
		let cell = row.children[j],
			input = cell.querySelector('input');
		if (!input) continue;	// probably a button in cell, so no need to handle it
		// Don't bind *enter* and *escape* keys to datepicker for submitting item; that's ambiguous.
		if (!cell.className.includes('due-date')) {
			input.addEventListener('keyup', function(event) {
				Util.detectEnterCancel(event, row.querySelector('.add-task'), row.querySelector('.cancel'));
			});
		} else $(input).datepicker({ minDate: /*today*/0 });
	}
});
