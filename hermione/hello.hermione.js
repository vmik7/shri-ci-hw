const assert = require('assert');

describe('Hello from hermione', () => {
    it('2 == 2', async function () {
        const browser = this.browser;

        console.log(browser);

        await browser.url('/');

        assert(2 == 2, '2 != 2, there is a problem :(');
    });
});
