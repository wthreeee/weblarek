import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

/**
 * Интерфейс данных для заголовка
 */
export interface IHeaderData {
    counter: number;
}

/**
 * Класс для заголовка
 */
export class HeaderView extends Component<IHeaderData> {
    protected _counter: HTMLElement;
    protected _basketButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = ensureElement<HTMLElement>('.header__basket-counter', container);
        this._basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);

        this._basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    /**
     * Установка счетчика корзины
     */
    set counter(value: number) {
        this._counter.textContent = value.toString();
    }

    /**
     * Рендеринг заголовка
     */
    render(data?: Partial<IHeaderData>): HTMLElement {
        if (data?.counter !== undefined) {
            this.counter = data.counter;
        }
        return this.container;
    }
}