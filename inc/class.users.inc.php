<?php

	/** Handles user interactions within the app */
	class AppUsers {
		private $_db;

		/** Checks for database connection or creates one */
		public function __construct($db=NULL) {
			if (is_object($db)) {
				$this->_db = $db;
			} else {
				$dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME;
				$this->_db = new PDO($dsn, DB_USER, DB_PASS);
			}
		}

		public function createAccount() {
			$u = trim($_POST['username']);
			$v = sha1(time());

			$sql = "SELECT COUNT(username) AS count FROM Users WHERE username=:email";
			if ($stmt = $this->_db->prepare($sql)) {
				$stmt->bindParam(":email", $u, PDO::PARAM_STR);
				$stmt->execute();
				$row = $stmt->fetch();
				if ($row['count'] > 0) {
					return "<h2>Error</h2>"
						. "<p>Sorry, that email is already in use. Please try again.</p>";
				}
				if (!$this->sendVerificationEmail($u, $v)) {
					return "<h2>Error</h2>"
						. "<p>There was an error sending your verification email. I wish we had a public help email :/";
				}
				$stmt->closeCursor();
			}

			$sql = "INSERT INTO Users(username, ver_code) VALUES (:email, :ver)";
			if ($stmt = $this->_db->prepare($sql)) {
				$stmt->bindParam(":email", $u, PDO::PARAM_STR);
				$stmt->bindParam(":ver", $v, PDO::PARAM_STR);
				$stmt->execute();
				$stmt->closeCursor();

				$userID = $this->_db->lastInsertId();
				$url = dechex($userID);
			} else {
				return "<h2>Error</h2>"
					. "<p>Couldn't insert the user information into our records.</p>";
			}
		}

		/**
	     * Sends an email to a user with a link to verify their new account
	     *
	     * @param string $email    	The user's email address
	     * @param string $ver    	The random verification code for the user
	     * @return boolean        	TRUE on successful send and FALSE on failure
	     */
		private function sendVerificationEmail($email, $ver) {
			$e = sha1($email);	// for verification
			$to = trim($email);

			$subject = "Please Verify Your Account";

			$headers = <<<MESSAGE
FROM: Get Things Done <calebjs88@gmail.com>
Content-Type: text/html;
MESSAGE;

			$msg = <<<EMAIL
Thanks for creating an account at Get Things Done!
To get started, please <a href="localhost/achievacity/accountverify.php?v=$ver&e=$e">activate your account</a>.
<br>
Your username: $email
EMAIL;

			return mail($to, $subject, $msg, $headers);
		}

		/**
	     * Sends a link to a user that lets them reset their password
	     *
	     * @param string $email    the user's email address
	     * @param string $ver    the user's verification code
	     * @return boolean        TRUE on success and FALSE on failure
	     */
		 private function sendResetEmail($email, $ver) {
			$e = sha1($email);	// for verification purposes
			$to = trim($email);

			$subject = "Request to Reset Your Password";

			$headers = <<<MESSAGE
FROM: Get Things Done <calebjs88@gmail.com>
Content-Type: text/html;
MESSAGE;

			$msg = <<<EMAIL
We just heard you forgot your password! The next step is to
<a href="localhost/achievacity/resetpassword.php?v=$ver&e=$e">choose a new password</a>.

GLHF
EMAIL;

			return mail($to, $subject, $msg, $headers);
		 }

		public function verifyAccount() {
			$sql = "SELECT Username FROM users WHERE ver_code=:ver AND SHA1(username)=:user AND verified=0";
			if ($stmt = $this->_db->prepare($sql)) {
				$stmt->bindParam(':ver', $_GET['v'], PDO::PARAM_STR);
				$stmt->bindParam(':user', $_GET['e'], PDO::PARAM_STR);
				$stmt->execute();
				$row = $stmt->fetch();
				if (isset($row['Username'])) {
					// log user in if verification was successful
					$_SESSION['Username'] = $row['Username'];
					$_SESSION['LoggedIn'] = 1;
				} else {
					return array(4, "<h2>Verification Error</h2>"
						. "<p>This account has already been verified lol.");
				}
				$stmt->closeCursor();

				// no error message if verification is successful
				return array(0, NULL);
			} else {
				return array(2, "<h2>Error</h2>" . "<p>Database error :'(</p>");
			}
		}

		/**
	     * Changes the user's password
	     *
	     * @return boolean    TRUE on success and FALSE on failure
	     */
		public function updatePassword() {
			if (isset($_POST['p']) && isset($_POST['r']) && $_POST['p'] == $_POST['r']) {
				$sql = "UPDATE users SET Password=MD5(:pass), verified=1 WHERE ver_code=:ver LIMIT 1";
				try {
					$stmt = $this->_db->prepare($sql);
					$stmt->bindParam(':pass', $_POST['p'], PDO::PARAM_STR);
					$stmt->bindParam(':ver', $_POST['v'], PDO::PARAM_STR);
					$stmt->execute();
					$stmt->closeCursor();

					return TRUE;
				} catch (PDOException $e) {
					return FALSE;
				}
			} else {
				return FALSE;
			}
		}

		/**
	     * Resets a user's status to unverified and sends them an email
	     *
	     * @return mixed    TRUE on success and a message on failure
	     */
		 public function resetPassword() {
			 $sql = "UPDATE users SET verified=0 WHERE Username=:user LIMIT 1";
			 try {
				 $stmt = $this->_db->prepare($sql);
				 $stmt->bindParam(':user', $_POST['username'], PDO::PARAM_STR);
				 $stmt->execute();
				 $stmt->closeCursor();
			 } catch (PDOException $e) {
				 return $e->getMessage();
			 }

			 // send reset email
			 if (!$this->sendResetEmail($_POST['username'], $v))
			 	return "Sending the email failed!";
			return TRUE;
		 }

		/**
	     * Changes a user's email address
	     *
	     * @return boolean    TRUE on success and FALSE on failure
	     */
		 public function updateEmail() {
			 $sql = "UPDATE users SET Username=:email WHERE UserID=:user LIMIT 1";
			 try {
				 $stmt = $this->_db->prepare($sql);
				 $stmt->bindParam(':email', $_POST['username'], PDO::PARAM_STR);
				 $stmt->bindParam(':user', $_POST['userid'], PDO::PARAM_INT);
				 $stmt->execute();
				 $stmt->closeCursor();

				 // update session variable
				 $_SESSION['Username'] = htmlentities($_POST['username'], ENT_QUOTES);

				 return TRUE;
			 } catch (PDOException $e) {
				 return FALSE;
			 }
		 }

		/**
	     * Checks credentials and logs in the user
	     *
	     * @return boolean    TRUE on success and FALSE on failure
	     */
		 public function accountLogin() {
			 $sql = "SELECT Username FROM users WHERE Username=:user AND Password=MD5(:pass) LIMIT 1";
			 try {
				 $stmt = $this->_db->prepare($sql);
				 $stmt->bindParam(':user', $_POST['username'], PDO::PARAM_STR);
				 $stmt->bindParam(':pass', $_POST['password'], PDO::PARAM_STR);
				 $stmt->execute();

				 if ($stmt->rowCount() == 1) {
					 $_SESSION['Username'] = htmlentities($_POST['username'], ENT_QUOTES);
					 $_SESSION['LoggedIn'] = 1;
					 return TRUE;
				 } else {
					 return FALSE;
				 }
			 } catch (PDOException $e) {
				 return FALSE;
			 }
		 }

		 /**
	     * Retrieves the ID and verification code for a user
	     *
	     * @return mixed    an array of info or FALSE on failure
	     */
		 public function retrieveAccountInfo() {
			 $sql = "SELECT UserID, ver_code FROM users WHERE username=:user";
			 try {
				 $stmt = $this->_db->prepare($sql);
				 $stmt->bindParam(':user', $_SESSION['Username']);
				 $stmt->execute();
				 $row = $stmt->fetch();
				 return array($row['UserID'], $row['ver_code']);
			 } catch (PDOException $e) {
				 return FALSE;
			 }
		 }

		 /**
	     * Deletes an account and all associated data
	     *
	     * @return void
	     */
		 public function deleteAccount() {
			 if (isset($_SESSION['LoggedIn']) && $_SESSION['LoggedIn'] == 1) {
				 // TODO: delete user content

				 // delete user
				 $sql = "DELETE FROM users WHERE UserID=:user AND Username=:email";
				 try {
					 $stmt = $this->_db->prepare($sql);
					 $stmt->bindParam(':user', $_POST['user-id'], PDO::PARAM_INT);
					 $stmt->bindParam(':email', $_SESSION['Username'], PDO::PARAM_STR);
					 $stmt->execute();
					 $stmt->closeCursor();
				 } catch (PDOException $e) {
					 die($e->getMessage());
				 }

				 // destroy user's session and send to confirmation page
				 unset($_SESSION['LoggedIn'], $_SESSION['Username']);
				 header("Location: ../gone.php");
				 exit;
			 } else {
				 header("Location: ../account.php?delete=failed");
				 exit;
			 }
		 }
	}

?>
