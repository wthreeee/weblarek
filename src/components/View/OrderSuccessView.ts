import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

/**
 * Интерфейс данных для успешного заказа
 */
export interface IOrderSuccessData {
    total: number;
}

/**
 * Класс для сообщения об успешном заказе
 */
export class OrderSuccessView extends Component<IOrderSuccessData> {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._description = ensureElement<HTMLElement>('.order-success__description', container);
        this._button = ensureElement<HTMLButtonElement>('.order-success__close', container);

        this._button.addEventListener('click', () => {
            this.events.emit('order:success-close');
        });
    }

    /**
     * Установка описания
     */
    set total(value: number) {
        this._description.textContent = `Списано ${value} синапсов`;
    }

    /**
     * Рендеринг успешного заказа
     */
    render(data?: Partial<IOrderSuccessData>): HTMLElement {
        if (data?.total !== undefined) {
            this.total = data.total;
        }
        return this.container;
    }
}