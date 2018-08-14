/** @module forms */

/**
 * Fake a <code>&lt;form&gt;</code> by detecting <em>enter</em>, along with <em>escape</em>.
 * @param {object} event - The <code>keyup</code> event.
 * @param {HTMLButtonElement} enterButton - The submit button.
 * @param {HTMLButtonElement} cancelButton - The cancel button.
 */
export function detectEnterCancel(event, enterButton, cancelButton) {
    var code = event.keyCode ? event.keyCode : event.which;
    if (code === 13) {
        // enter
        enterButton.click();
    } else if (code === 27) {
        // escape
        cancelButton.click();
    }
}

/**
 * Checks if all the inputs are correct in <code>row</code>; if not, error(s) are generated
 * @param {HTMLTableRowElement} row
 * @return {boolean} <code>true</code> if all the inputs are valid and <code>false</code> otherwise
 */
export function validateRow(row) {
    let passed = true;
    let requiredKeys = ['name', 'description', 'due-date'];	// weight cannot be invalid

    for (let i=0; i<requiredKeys.length; i++) {
        let key = requiredKeys[i];
        let input = row.querySelector('.' + key + ' input');
        // make sure `validate(input)` is before `passed`, so it is guaranteed to be called (to show the error)
        passed = validate(input) && passed;
    }
    return passed;
}

/**
 * Runs the <code>input</code> against <code>test</code> to check validaty.
 * If <code>input</code> is invalid, a class <code>.invalid</code> will be added to it.
 * @param {HTMLInputElement} input - The input element to test.
 * @param {inputValidator} test
 *
 * @return {boolean} <code>true</code> if the input is valid and <code>false</code> otherwise.
 */
export function validate(input, test) {
    test = test || function(input){return !!input.value};	// default test checks for input in required field
    let result = test(input);
    if (!result) displayInputError(input);
    return result;
}

/**
 * For empty required fields
 * @private
 */
function displayInputError(input) {
    $(input).addClass('invalid');
}

/**
 * @param {HTMLInputElement} input - The input element to validate.
 * @return {boolean} <code>true</code> if the input is valid and <code>false</code> otherwise.
 */
