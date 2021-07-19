const delay = require('delay');

describe('Стартовый экран.', () => {
    it('Скриншот всей страницы', async function () {
        const browser = this.browser;

        await browser.url('/start');

        // Ждём, пока загрузятся данные для хедера
        await delay(1000);

        await browser.assertView('app', '.app');
    });
});
