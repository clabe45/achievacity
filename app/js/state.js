/**
 * Represents global state, such as whether it is safe to exit.
 * @module state
 */

/** <code>true</code> if there are important edits being made and <code>false</code> otherwise. */
let confirmExitMessage = null;

/**
 * Sets what will be returned in <code>window.onbeforeunload</code>.
 * @param {string|null} message - The new confirmation message.
 */
export function setConfirmExitMessage(message) {
    confirmExitMessage = message;
}

/**
 * Convenience method for {@link setConfirmExitMessage}
 * Sets the exit confirmation message to <code>null</code>.
 */
export function clearConfirmExitMessage() {
    setConfirmExitMessage(null);
}

/**
 * Gets what will be returned in <code>window.onbeforeunload</code>.
 * @return {string|null} - The current confirmation message.
 */
export function getConfirmExitMessage() {
    return confirmExitMessage;
}

export function init() {
    window.onbeforeunload = function() {
        return confirmExitMessage;
    };
}
