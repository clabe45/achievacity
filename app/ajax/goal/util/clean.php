<?php
    /*
     * Prepares raw data from database for client
     */

     function clean_row($row) {
         // hide invisible data
         unset($row->id);
         unset($row->user_id);
         unset($row->created);

         $row->due_date = date('m/d/Y', strtotime($row->due_date));	// reformat to match jQueryUI datepicker
     }

?>
