<?php
	/*
	 * Delete a goal. User must be logged in, and a goal with this name must exit?.
	 */
	if ($_SERVER['REQUEST_METHOD'] == 'POST') {
		header('Content-Type: application/json');
		require_once "../../../users/init.php";	// ew TODO: figure absolute/relative paths out

		// taken from header.php (the rest will clutter json output with html)
		$db = DB::getInstance();
		$user_id = $user->data()->id;
		$name = $_POST['name'];	// goal name

		$goal = $db->query("SELECT id FROM goals WHERE user_id=? AND name=? LIMIT 1", [ $user_id, $name ]);
		$goal_id = $goal->first()->id;

		$db->deleteById('goals', $goal_id);
		// TODO: error/success reporting with $db->error(), etc.

		echo json_encode([]);
	}
?>
