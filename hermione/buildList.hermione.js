// const assert = require('assert');

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
});
