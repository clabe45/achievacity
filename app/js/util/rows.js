/**
 * For row-related things such as events.
 * @module rows
 */

let rowListeners = [];

/**
 * Registers <code>callback</code> to execute when a newly added row is registered (as complete) with
 *  {@link module:rows.registerRow registerRow}.
 * @param {function} callback
 */
export function addRowListener(callback) {
    rowListeners.push(callback);
}

/**
 * Use this when a row is complete and ready to be processed by other files.
 * @param {HTMLTableRowElement} row
 */
export function registerRow(row) {
    for (let i=0; i<rowListeners.length; i++) {
        let callback = rowListeners[i];
        callback(row);
    }
}
