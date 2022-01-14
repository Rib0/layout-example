import { getElement } from './utils';

export default class {
    constructor() {
        const button = getElement('button.header__burger');
        this.navMenu = getElement('nav');

        this.navMenu.addEventListener('click', this.handleClickMenuItem);
        button.addEventListener('click', this.handleClickBurger);
    }

    handleClickBurger = () => {
        const navClassList = this.navMenu.classList;

        if (navClassList.contains('active')) {
            document.body.style.overflow = ''
        } else {
            document.body.style.overflow = 'hidden';
        };

        navClassList.toggle('active');
    }

    handleClickMenuItem = (event) => {
        const { target: { tagName } } = event;

        if (tagName === 'A' && this.navMenu.classList.contains('active')) {
            this.handleClickBurger()
        }
    }
}