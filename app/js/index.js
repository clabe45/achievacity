/**
 * Initiates the frontend of the web app.
 * @module index
 */

import { init as initState } from './state.js';
import { init as initCreate } from './create.js';
import { init as initEdit } from './edit.js';
import { init as initLoad } from './load/index.js';

initState();
initCreate();
initEdit();
initLoad();
