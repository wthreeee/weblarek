import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

/**
 * Интерфейс данных для корзины
 */
export interface IBasketData {
    items: HTMLElement[];
    total: number;
    isEmpty?: boolean;
}

/**
 * Класс для корзины
 */
export class BasketView extends Component<IBasketData> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

        this._button.addEventListener('click', () => {
            this.events.emit('order:start');
        });
    }

    /**
     * Установка списка товаров
     */
    set items(items: HTMLElement[]) {
        this._list.replaceChildren(...items);
    }

    /**
     * Установка общей суммы
     */
    set total(value: number) {
        this._total.textContent = `${value} синапсов`;
    }

    /**
     * Рендеринг корзины
     */
    render(data?: Partial<IBasketData>): HTMLElement {
        if (data?.items !== undefined) {
            if (data.items.length === 0) {
                const emptyMessage = document.createElement('li');
                emptyMessage.className = 'basket__item';
                emptyMessage.textContent = 'Корзина пуста';
                this._list.replaceChildren(emptyMessage);
            } else {
                this.items = data.items;
            }
        }
        if (data?.total !== undefined) {
            this.total = data.total;
        }
        this._button.disabled = data?.items?.length === 0;
        return this.container;
    }
}