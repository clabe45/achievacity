var Util = (function() {
    let rowListeners = [];
    /** fake a <code>&lt;form&gt;</code> */
	function detectEnterCancel(event, enterButton, cancelButton) {
		var code = event.keyCode ? event.keyCode : event.which;
		if (code === 13) {
			// enter
			enterButton.click();
		} else if (code === 27) {
			// escape
			cancelButton.click();
		}
	}

    /** @private; @return {string} <code>m/d/Y</code>*/
	function tomorrow() {
		let date = new Date();
		date.setDate(date.getDate() + 1);
		return date.toLocaleDateString(/*'en-US' shouldn't effect it too much, because it's only numbers*/'en-US', {
			month: '2-digit', day: '2-digit', year: 'numeric'
		});
	}

	/**
	 * @private Checks if all the inputs are correct in <code>row</code>; if not, error(s) are generated
	 * @return {boolean} whether all the inputs are valid or not
	 */
	function validateRow(row) {
		let passed = true;
		let requiredKeys = ['name', 'description', 'due-date'];	// weight cannot be invalid

		for (let i=0; i<requiredKeys.length; i++) {
			let key = requiredKeys[i];
			let input = $(row.querySelector('.' + key + ' input'));
			// make sure `validate(input)` is before `passed`, so it is guaranteed to be called (to show the error)
			passed = validate(input) && passed;
		}
		return passed;
	}

	/**
	 * Runs the <code>input</code> against <code>test</test> to check validaty.
	 * If <code>input</code> is invalid, a class <code>.invalid</code> will be added to it.
	 * @param {HTMLInputElement} input
	 * @callback test
	 * @param {HTMLInputElement} input the provided input
	 * @return {boolean} whether the input is valid or not
	 *
	 * @return {boolean} whether th einput is valid or not
	 */
	function validate(input, test) {
		test = test || function(input){return !!input.value};	// default test checks for input in required field
		let result = test(input);
		if (!result) displayInputError(input);
		return result;
	}

	/** @private For empty required fields */
	function displayInputError(input) {
		$(input).addClass('invalid');
	}

    /**
     * Registers `callback` to execute when a newly added row is registered with registerRow.
     * @param {function} callback
     */
    function addRowListener(callback) {
        rowListeners.push(callback);
    }

    /**
     * Use this when a row is complete and ready to be processed by other files
     * @param {HTMLTableRowElement} row
     */
    function registerRow(row) {
        for (let i=0; i<rowListeners.length; i++) {
            let callback = rowListeners[i];
            callback(row);
        }
    }

    return {
        detectEnterCancel: detectEnterCancel,
        tomorrow: tomorrow,
        validateRow: validateRow,
        validate: validate,
        addRowListener: addRowListener,
        registerRow: registerRow
    }
})();
