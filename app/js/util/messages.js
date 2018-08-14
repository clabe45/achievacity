/** @module messages */

/**
 * Displays a red (<code>#global-error</code>) global message.
 * @param {string} message
 */
export function showError(message) {
    showMessage('error', message);
}

/**
 * Displays a green (<code>#global-success</code>) global message.
 * @param {string} message
 */
export function showSuccess(message) {
    showMessage('success', message);
}

/**
 * Displays a global message.
 * @param {string} type - either <code>"error"</code> or <code>"success"</code>
 */
export function showMessage(type, message) {
    // hide opposite message div if visible
    let otherType = type === 'error' ? 'success' : 'error';
    let otherDiv = document.getElementById(`global-${otherType}`);
    if (!$(otherDiv).is(':hidden') )
    $(otherDiv).hide();

    let messageDiv = document.getElementById(`global-${type}`);
    if ( $(messageDiv).is(':hidden') )
        $(messageDiv).show();
    else
        clearInterval(messageDiv.dataset.timerIdHide);    // don't hide early

    messageDiv.innerHTML = message;
    messageDiv.dataset.timerIdHide = setTimeout(function() {
        $(message).hide();
        delete messageDiv.dataset.timerIdHide;
    }, 8000);
}
