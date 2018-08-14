/** @module ajax */

import * as messages from './messages.js';

/**
 * Performs an ajax request of type <code>POST</code> (through jQuery),
 * and displays a message based on the response.
 * @param {string} url - The from the root directory.
 * @param {object} data
 */
export default function post(url, data) {
    return new Promise(function(resolve, reject) {
        $.post(url, data)
            .done(function(data) {
                if (data['message']) {
                    if (data['success']) messages.showSuccess(data['message']);
                    else messages.showError(data['message']);
                }
                if (resolve) resolve(data);
            })
            .fail(function(xhr, status, error) {
                messages.showError('An internal error occurred.');    // TODO: make more specific
                if (reject) reject(error);
            });
    })
}
