<?php
	/*
		User must be logged in.
		TODO: sort by relevance (i.e., due_date and weight)
	*/
	if ($_SERVER['REQUEST_METHOD'] == 'POST') {
		header('Content-Type: application/json');
		require_once "../../../users/init.php";	// ew TODO: figure absolute/relative paths out
		// taken from header.php (the rest will clutter json output with html)
		$db = DB::getInstance();

		$goals = $db->query('SELECT * FROM goals WHERE user_id=?', [$user->data()->id]);
		$return = $goals->results();
		// hide invisible data
		foreach ($return as &$row) {
			unset($row->id);
			unset($row->user_id);

			$row->due_date = date('m/d/Y', strtotime($row->due_date));	// reformat to match jQueryUI datepicker
		}


		echo json_encode($return);
	}
?>
