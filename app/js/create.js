/**
 * @file For task creation
 * TODO: Only allow one creation row at a time.
 * TODO: in this file and in edit.js, don't detect ENTER and ESC when datepicker is opened
 */
$(document).ready(function() {
	$('#add-goal').click(function() {
		createGoalTemplate(document.getElementById('goals-table'));
	});

	/**
	 * Appends a fake, editable table row for creating a new goal
	 * (notice that no cells have .editable, which prevents them from becoming readonly)
	 */
	function createGoalTemplate(table) {
		let row = table.insertRow(-1);	// append row
		let name = document.createElement('input');
		name.type = 'text';
		name.placeholder = 'Get Discord';
		name.addEventListener('keyup', detectEnterCancel);
		row.insertCell(-1).appendChild(name);
		name.focus();

		let description = document.createElement('input');
		description.type = 'text';
		description.placeholder = 'because Discord is the best social app';
		description.addEventListener('keyup', detectEnterCancel);
		row.insertCell(-1).appendChild(description);

		let dueDate = document.createElement('input');
		dueDate.type = 'text';
		$(dueDate).datepicker();	// no need for event handling here, so no `onSelect`
		dueDate.addEventListener('keyup', detectEnterCancel);
		row.insertCell(-1).appendChild(dueDate);

		let weight = document.createElement('input');
		weight.type = 'number';
		weight.min = 1;
		weight.max = 5;
		weight.placeholder = 3;
		weight.addEventListener('keyup', detectEnterCancel);
		row.insertCell(-1).appendChild(weight);

		let addButton = document.createElement('button');
		addButton.innerHTML = 'Add';
		addButton.addEventListener('click', function() {
			// TODO: validate and display error(s) if necessary
			createGoal(name.value, description.value, dueDate.value, weight.value);
		});
		row.insertCell(-1).appendChild(addButton);

		let cancelButton = document.createElement('button');
		cancelButton.innerHTML = 'Cancel';	// TODO: replace these with images?
		cancelButton.addEventListener('click', function() {
			table.deleteRow(-1);	// delete this row (last one)
		});
		row.insertCell(-1).appendChild(cancelButton);

		// fake a <form>
		function detectEnterCancel(event) {
			var code = event.keyCode ? event.keyCode : event.which;
			if (code === 13) {
				// enter
				addButton.click();
			} else if (code === 27) {
				// escape
				cancelButton.click();
			}
		}
	}

	function tomorrow() {
		let date = new Date();
		date.setDate(date.getDate() + 1);
		return date;
	}

	function createGoal(name, description, dueDate, weight) {
		$.post(
			'app/ajax/goal/create.php',		// called from root
			{ name: name, description: description, 'due-date': dueDate, weight: weight }
		)
			.done(function(data) {
				// TODO: Display message here
				Refresh.goals();
			})
			.fail(function(xhr, status, error) {
				throw 'Error creating goal: ' + error;
			});

	}
});
