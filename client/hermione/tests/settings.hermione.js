const delay = require('delay');

describe('Страница настроек.', () => {
    it('Скриншот всей страницы', async function () {
        const browser = this.browser;

        await browser.url('/settings');

        // Ждём, пока загрузятся данные для хедера
        // TODO: Так плохо, надо чтобы был SSR и данные были сразу
        await delay(1000);

        await browser.assertView('app', '.app');
    });
});
