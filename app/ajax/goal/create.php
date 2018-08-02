<?php
	/*
		User must be logged in.
	*/
	if ($_SERVER['REQUEST_METHOD'] == 'POST') {
		// header('Content-Type: application/json');
		require_once "../../../users/init.php";

		// taken from header.php (the rest will clutter json output with html)
		$db = DB::getInstance();
		$return = [];
		$user_id = $user->data()->id;
		$goal = [
			'user_id' => $user_id,
			'name' => $_POST['name'],
			'description' => $_POST['description'],
			'due_date' => $_POST['due-date'],
			'weight' => $_POST['weight']
		];

		// Check if user has a goal or routine named `$goal['name']`.
		$existing_goal = $db->query("SELECT * FROM goals WHERE user_id=? AND name=? LIMIT 1", [$user_id, $goal['name']]);
		$existing_routine = $db->query("SELECT * FROM routines WHERE user_id=? AND name=? LIMIT 1", [$user_id, $goal['name']]);
		// TODO: do this sort of error reporting in all ajax files
		if ($existing_goal->count() > 0) {
			$return['success'] = false;
			$return['message'] = "Existing goal '{$goal['name']}'!";
			die(json_encode($return));
		} else if ($existing_routine->count() > 0) {
			$return['success'] = false;
			$return['message'] = "Existing routine '{$goal['name']}'!";
			die(json_encode($return));
		}

		$db->insert('goals', $goal);
		$return['success'] = true;
		$return['message'] = "Goal '{$goal['name']}' added successfully!";
		echo json_encode($return);

	} else {
		header('Location: /achievacity');
		die();
	}
?>
