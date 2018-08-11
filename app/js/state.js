/** Set this when important edits are unsaved. */
var confirmExitMessage = null;

window.onbeforeunload = function() {
    return confirmExitMessage;
};
