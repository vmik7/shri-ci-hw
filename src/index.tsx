import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import { store } from './store';

import { App } from './App';

import './nullstyle.css';
import './index.scss';
import './counter';

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>,
    document.getElementById('root'),
);

// TODO: d.ts -> ts
// TODO: Ошибка отображения страницы деталей
// TODO: Неправильная обработка форм
// TODO: Сделать loader-иконку
// TODO: Mock для тестов
// TODO: Тесты
