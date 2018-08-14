/** @module dates */

/** @return {string} <code>m/d/Y</code> (e.g., <code>08/28/2018</code>)*/
export function tomorrow() {
    let date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString(/*'en-US' shouldn't effect it too much, because it's only numbers*/'en-US', {
        month: '2-digit', day: '2-digit', year: 'numeric'
    });
}
