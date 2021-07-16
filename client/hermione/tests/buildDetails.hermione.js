const delay = require('delay');

describe('Страница деталей сборки и логи.', () => {
    it('Скриншот всей страницы', async function () {
        const browser = this.browser;

        await browser.url('/build/test_id_1');

        // Ждём, пока загрузятся данные для хедера
        // TODO: Так плохо, надо чтобы был SSR и данные были сразу
        await delay(1000);

        await browser.assertView('app', '.app');
    });
});
