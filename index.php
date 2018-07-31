<?php
/*
UserSpice 4
An Open Source PHP User Management System
by the UserSpice Team at http://UserSpice.com

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
?>
<?php
require_once 'users/init.php';
require_once $abs_us_root.$us_url_root.'users/includes/header.php';
require_once $abs_us_root.$us_url_root.'users/includes/navigation.php';
?>

<?php if (!securePage($_SERVER['PHP_SELF'])){die();} ?>

<div id="page-wrapper">
	<div class="container-fluid">
		<!-- Page Heading -->
		<div class="row">
			<div class="col-sm-12">

				<!-- My content -->
				<?php if (!$user->isLoggedIn()): ?>
				<h1 class="page-header">
					Welcome to Achievacity
					<small>For those who want to get things done</small>
				</h1>
				<h3>What is it?</h3>
				<big>Achievacity is a web app that scores user success with accomplishing any <strong>routines</strong> and <strong>goals</strong>.</big>
				<h3>How does it work?</h3>
				<big>Every day, the app creates a score by averaging your success with all your goals.</big>
				<h3>How can I start?</h3>
				<big>You can <a href="users/join.php">register</a>!</big>

				<?php else: ?>
				<em>[app content goes here]</em>

				<?php endif; ?>

			</div> <!-- /.col -->
		</div> <!-- /.row -->
	</div> <!-- /.container -->
</div> <!-- /.wrapper -->


<?php require_once $abs_us_root.$us_url_root.'users/includes/page_footer.php'; // the final html footer copyright row + the external js calls ?>

<!-- Place any per-page javascript here -->

<?php require_once $abs_us_root.$us_url_root.'users/includes/html_footer.php'; // currently just the closing /body and /html ?>
