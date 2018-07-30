<!DOCTYPE html>
<html>
<head>
	<title><?php echo $pageTitle; ?> | Achievacity</title>

	<link rel="stylesheet" href="style.css" type="text/css" />
	<link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet"><!-- font-->
	<!-- <link rel="shortcut icon" type="image/x-icon" href="../favicon.ico" /> -->

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
</head>
<body>
	<div id="page-wrap">
		<?php include_once "sidebar.php"; ?>
		<div id="right"><!-- the inverse of #ribbon (the sidebar) -->
			<div id="header">
				<h1><a href="/achievacity">Achievacity</a></h1>
				<div id="control">
	<?php
		if (isset($_SESSION['LoggedIn']) && isset($_SESSION['Username']) && $_SESSION['LoggedIn'] == 1):
	?>
					<p><a href="logout.php" class="button">Log out</a> &nbsp; <a href="account.php" class="button">My Account</a></p>
	<?php else: ?>
					<p><a href="signup.php" class="button">Sign up</a> &nbsp; <a href="login.php" class="button">Log in</a></p>
	<?php endif; ?>
				</div>
			</div>
