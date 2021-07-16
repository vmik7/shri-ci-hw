// const assert = require('assert');
const delay = require('delay');

describe('Главная страница - список сборок.', () => {
    it('По клику на кнопу "Добавить" открывается модальное окно', async function () {
        const browser = this.browser;

        await browser.url('/');

        await (await browser.$('.header__control:nth-of-type(1)')).click();

        const modal = await browser.$('.new-build');
        modal.waitForExist();
    });

    it('По клику на кнопу "Настроки" открывается страница настроек', async function () {
        const browser = this.browser;

        await browser.url('/');

        await (await browser.$('.header__control:nth-of-type(2)')).click();

        const modal = await browser.$('.settings');
        modal.waitForExist();
    });

    it('Корректно отображается header', async function () {
        const browser = this.browser;

        await browser.url('/');

        // Ждём, пока загрузятся данные для хедера
        // TODO: Так плохо, надо чтобы был SSR и данные были сразу
        await delay(1000);

        await browser.assertView('header', '.header');
    });

    it('Корректно отображается footer', async function () {
        const browser = this.browser;

        await browser.url('/');

        // Ждём, пока загрузятся данные для хедера
        // TODO: Так плохо, надо чтобы был SSR и данные были сразу
        await delay(100);

        await browser.assertView('footer', '.footer');
    });

    it('Скриншот всей страницы', async function () {
        const browser = this.browser;

        await browser.url('/');

        // Ждём, пока загрузятся данные для хедера
        // TODO: Так плохо, надо чтобы был SSR и данные были сразу
        await delay(1000);

        await browser.assertView('app', '.app');
    });
});
