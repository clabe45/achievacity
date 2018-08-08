<?php
	/*
	 * Delete a goal. User must be logged in, and a goal with this name must exit?.
	 */
	if ($_SERVER['REQUEST_METHOD'] == 'POST') {
		header('Content-Type: application/json');
		require_once "../../../users/init.php";	// ew TODO: figure absolute/relative paths out

		$return = [];
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

		$db->deleteById('goals', $goal_id);
		if (!$db->error()) {
			$return['success'] = true;
			$return['message'] = "Goal '$name' deleted successfully!";
		} else {
			$return['success'] = false;
			$return['message'] = "An internal server error occured.";
		}

		echo json_encode($return);
	}
?>
