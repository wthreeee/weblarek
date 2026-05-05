import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

/**
 * Интерфейс данных для страницы
 */
export interface IPageData {
    counter: number;
}

/**
 * Класс для основной страницы
 */
export class PageView extends Component<IPageData> {
    protected _counter: HTMLElement;
    protected _gallery: HTMLElement;
    protected _basket: HTMLElement;
    protected _wrapper: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = container.querySelector('.header__basket-counter') as HTMLElement;
        this._gallery = container.querySelector('.gallery') as HTMLElement;
        this._basket = container.querySelector('.basket') as HTMLElement;
        this._wrapper = container.querySelector('.page__wrapper') as HTMLElement;
    }

    /**
     * Установка счетчика корзины
     */
    set counter(value: number) {
        this._counter.textContent = value.toString();
    }

    /**
     * Блокировка страницы
     */
    set locked(value: boolean) {
        this._wrapper.classList.toggle('page__wrapper_locked', value);
    }

    /**
     * Рендеринг страницы
     */
    render(data?: Partial<IPageData>): HTMLElement {
        if (data?.counter !== undefined) {
            this.counter = data.counter;
        }
        return this.container;
    }
}