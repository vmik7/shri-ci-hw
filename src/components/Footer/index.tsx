import React from 'react';

import './style.scss';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer__container">
                <ul className="footer__list">
                    <li className="footer__item">
                        <a href="*" className="footer__link">
                            Support
                        </a>
                    </li>
                    <li className="footer__item">
                        <a href="*" className="footer__link">
                            Learning
                        </a>
                    </li>
                    <li className="footer__item">
                        <a href="*" className="footer__link">
                            Русская версия
                        </a>
                    </li>
                </ul>
                <p className="footer__copyright">© 2020 Your Name</p>
            </div>
        </footer>
    );
}
