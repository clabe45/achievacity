<!-- this file should be included in /index.php -->
<!-- TODO: adjust table column widths to fit better -->
<!-- TODO: show message when there are no goals -->
<script type="module" src="app/js/index.js"></script>
<div id="global-messages">
	<div id="global-success" class="global-message" style="display:none">success</div>
	<div id="global-error" class="global-message" style="display:none">error</div>
</div>
<div id="tasks">
	<div id="goals">
		<h2>Goals</h2>
		<table id="goals-table">
			<thead>
				<tr>
					<th><strong>Name</strong></th>
					<th><strong>Description</strong></th>
					<!-- TODO? better way to show that Reason is an optional field? -->
					<th><strong><em>Reason</em></strong></th>
					<th><strong>Due Date</strong></th>
					<th><strong>Weight</strong></th>
					<th><strong>Completed?</strong>
					<th><!-- empty column for buttons such as Delete --></th>
				</tr>
			</thead>
			<tbody></tbody>
		</table>
		<button id="start-goal">Create goal</button>
	</div>
	<!-- #start-goal lies below its parent div, so add a break :/ --><br><hr />
	<div id="routines">
		<h2>Routines</h2>
		<table id="routines-table">
			<!-- TODO -->
		</table>
		<button id="start-routine" disabled>Create routine</button>
	</div>
</div>
<div id="scores">
	[score visuals here]
</div>
