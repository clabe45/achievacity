<?php
	include_once "common/base.php";

	if (isset($_GET['v']) && isset($_GET['e'])) {
		include_once "inc/class.users.inc.php";
		$users = new AppUsers($db);
		$ret = $users->verifyAccount();
	} elseif (isset($_POST['v'])) {
		include_once "inc/class.users.inc.php";
		$users = new AppUsers($db);
		$status = $users->updatePassword() ? "changed" : "failed";
		header("Location: ../account.php?password=$status");
		exit;
	} else {
		header("Location: ../login.php");
		exit;
	}

	$pageTitle = "Reset Your Password";
	include_once "common/header.php";

	if (isset($ret[0])):
		echo isset($ret[1]) ? $ret[1] : NULL;
		if ($ret[0] < 3):
?>
<h2>Reset Your Password</h2>

<form method="post" action="accountverify.php">
	<div>
		<input type="hidden" name="v" value="<?php echo $_GET['v'] ?>"/>
		<label for="p">Choose a new password:</label>
		<input type="password" name="p" id="p"/><br>
		<label for="r">Confirm new password:</label>
		<input type="password" name="r" id="r"/><br>
		<input type="submit" name="verify" id="verify" value="Reset Your Password"/>
	</div>
</form>

<?php
		endif;
	else:
		echo '<meta http-equiv="refresh" content="0;/achievacity">';
	endif;

	include_once "common/close.php";
?>
