<?php
	include_once "common/base.php";
	$pageTitle = "Reset Your Password";
	include_once "common/header.php";
?>
<h2>Reset Your Password</h2>
<p>Enter your email and we'll send a link to reset your password.</p>

<form.action="db-interaction/users.php" method="post">
	<div>
		<input type="hidden" name="action" value="resetpassword" />
		<input type="text" name="username" id="username" />
		<label for="username">Email</label><br><br>
		<input type="submit" name="reset" id="reset" value="Reset Password" class="button" />
	</div>
</form>

<?php include_once "common/close.php"; ?>
