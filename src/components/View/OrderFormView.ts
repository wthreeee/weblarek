import { FormView, IFormData } from './FormView';
import { IEvents } from '../base/Events';
import { TPayment } from '../../types/index';
import { ensureAllElements, ensureElement } from '../../utils/utils';

/**
 * Интерфейс данных для формы заказа
 */
export interface IOrderFormData extends IFormData {
    payment: TPayment;
    address: string;
}

/**
 * Класс для формы заказа
 */
export class OrderFormView extends FormView {
    protected _paymentButtons: HTMLButtonElement[];
    protected _address: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', container);
        this._address = ensureElement<HTMLInputElement>('.form__input[name="address"]', container);

        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.events.emit('order:payment-change', { payment: button.name as TPayment });
            });
        });

        this._address.addEventListener('input', () => {
            this.events.emit('order:address-change', { address: this._address.value });
        });
    }

    /**
     * Установка способа оплаты
     */
    set payment(value: TPayment) {
        this._paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === value);
        });
    }

    /**
     * Установка адреса
     */
    set address(value: string) {
        this._address.value = value;
    }

    /**
     * Рендеринг формы заказа
     */
    render(data?: Partial<IOrderFormData>): HTMLElement {
        super.render(data);
        if (data?.payment) {
            this.payment = data.payment;
        }
        if (data?.address !== undefined) {
            this.address = data.address;
        }
        return this.container;
    }
}