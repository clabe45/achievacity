<?php
	/*
	 * Update a single piece of data for a task. User must be logged in, and a goal with this name must exit.
	 */
	if ($_SERVER['REQUEST_METHOD'] == 'POST') {
		header('Content-Type: application/json');
		require_once "../../../users/init.php";	// ew TODO: figure absolute/relative paths out

		// taken from header.php (the rest will clutter json output with html)
		$db = DB::getInstance();
		$user_id = $user->data()->id;
		$name = $_POST['name'];	// goal name

		$goal = $db->query("SELECT id FROM goals WHERE user_id=? AND name=? LIMIT 1", [ $user_id, $name ]);
		if (!$goal->first()) {
			$return['success'] = false;
			$return['message'] = "Goal '$name' does not exist!";
			die(json_encode($return));
		}
		$goal_id = $goal->first()->id;

		$key = str_replace('-', '_', $_POST['key']);	// convert format from front-end to back-end
		$value = $_POST['value'];

		// special types
		if (strpos($key, 'date'))
			$value = date('Y-m-d', strtotime($value));	// reformat for SQL datetime
		elseif ($key == 'completed')	// (checkbox)
			// string to boolean (PDO uses boolean for SQL BIT), and preserve NULL
			$value = $value == null ? null : $value === 'true';

		$db->update('goals', $goal_id, [ $key => $value ]);
		if (!$db->error()) {
			$return['success'] = true;
			$return['message'] = null;	// no need to display a message on edit
		} else {
			$return['success'] = false;
			$return['message'] = "An internal server error occured.";
		}

		echo json_encode([]);
	}
?>
