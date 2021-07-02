// const assert = require('assert');

describe('Главная страница - список сборок.', () => {
    it('По клику на кнопу "Добавить" открывается модальное окно', async function () {
        const browser = this.browser;

        await browser.url('/');

        await (await browser.$('.button.header__control')).click();

        const modal = await browser.$('.new-build');
        modal.waitForExist();
    });
});
