<?php
	/*
		Retrieves information of a single task (item).
		User must be logged in.
	*/
	if ($_SERVER['REQUEST_METHOD'] == 'POST') {
		header('Content-Type: application/json');
		require_once "../../../users/init.php";	// ew TODO: figure absolute/relative paths out
        require_once "clean.php";
		// taken from header.php (the rest of that file would clutter json output with html)
		$db = DB::getInstance();

        $name = $_POST['name'];

		$result = $db->query('SELECT * FROM goals WHERE user_id=? AND name=? LIMIT 1', [$user->data()->id, $name]);
        $goal = $result->first();
		clean_row($goal);

		$return = $goal;
		echo json_encode($return);
	}
?>
