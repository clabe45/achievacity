<!-- should be included in /index.php -->
<script src="app/js/refresh.js"></script>
<script src="app/js/create.js"></script>
<script src="app/js/edit.js"></script>
<div id="tasks">
	<div id="goals">
		<h2>Goals</h2>
		<table id="goals-table">
			<tr>
				<td><strong>Name</strong></td>
				<td><strong>Description</strong></td>
				<td><strong>Due Date</strong></td>
				<td><strong>Weight</strong></td>
				<td><strong>Completed?</strong>
				<td><!-- empty column for buttons such as Delete --></td>
			</tr>
		</table>
		<button id="add-goal">Add goal</button>
	</div>
	<div id="routines">
		<h2>Routines</h2>
		<table id="routines-table">
			<tr><td><strong>Name</strong></td><td><strong>Description</strong></td><strong>Due Date</strong></td><strong>Weight</strong></td</tr>
			<tr>
				<td class="data name"><input type="text" value="Sample routine 0" readonly/></td>
				<td class="data description"><input type="text" value="Sample description 0" readonly/></td>
				<td class="data due-date"><!-- will become date with jQuery UI--><input type="text" readonly/></td>
				<td class="data weight"><input type="number" min="1" max="5" value="3" readonly/></td>
			</tr>		</table>
		<button id="add-routine" disabled>Add routine</button>
	</div>
</div>
<div id="score">
	[score visuals here]
</div>
