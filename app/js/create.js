/**
 * @file For task creation
 * TODO: Only allow one creation row at a time.
 * TODO: in this file and in edit.js, don't detect ENTER and ESC when datepicker is opened?
 */
var Create = (function() {
	$(document).ready(function() {
		$('#start-goal').click(function() {
			Refresh.newItem.goal();
			$(this).hide();	// don't let users start creating two goals at once
		});
	});

	function createGoal(name, description, dueDate, weight) {
		Util.post(
			'app/ajax/goal/create.php',		// called from root
			{ 'name': name, 'description': description, 'due-date': dueDate, 'weight': weight }
		)
			.then(function(data) {
				Refresh.list.goals();
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
				Util.detectEnterCancel(event, row.querySelector('.add-task'), row.querySelector('.cancel-task'));
			});
		} else $(input).datepicker({ minDate: /*today*/0 });
	}
	row.querySelector('.add-task').addEventListener('click', function() {
		$('#start-goal').show();	// now user can create another goal
	});
	row.querySelector('.cancel-task').addEventListener('click', function() {
		$('#start-goal').show();	// now user can create another goal
	});
});
