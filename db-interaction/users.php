<?php

	session_start();

	include_once "../inc/constants.inc.php";
	include_once "../inc/class.users.inc.php";
	$users = new AppUsers();

	if (!empty($_POST['action']) && isset($_SESSION['LoggedIn']) && $_SESSION['LoggedIn'] == 1) {
		switch ($_POST['action']) {
			case 'changeemail':
				$status = $users->updateEmail() ? "changed" : "failed";
				header("Location: ../account.php?email=$status");
				break;
			case 'changepassword':
				$status = $users->updatePassword() ? "changed" : "failed";
				header("Location: ../account.php?password=$status");
				break;
			case 'deleteaccount':
				$users->deleteAccount();
				break;
			default:
				header("Location: ..");
				break;
		}
	} elseif ($_POST['action'] == 'resetpassword') {	// why is this here??
		if ($resp=$users->resetPassword()===TRUE)
			header("Location: /resetpending.php");
		else
			echo $resp;
		exit;
	} else {
		header("Location: ..");
		exit;
	}
