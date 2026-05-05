import { FormView, IFormData } from './FormView';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

/**
 * Интерфейс данных для формы контактов
 */
export interface IContactsFormData extends IFormData {
    email: string;
    phone: string;
}

/**
 * Класс для формы контактов
 */
export class ContactsFormView extends FormView {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._email = ensureElement<HTMLInputElement>('.form__input[name="email"]', container);
        this._phone = ensureElement<HTMLInputElement>('.form__input[name="phone"]', container);

        this._email.addEventListener('input', () => {
            this.events.emit('contacts:email-change', { email: this._email.value });
        });

        this._phone.addEventListener('input', () => {
            this.events.emit('contacts:phone-change', { phone: this._phone.value });
        });
    }

    /**
     * Установка email
     */
    set email(value: string) {
        this._email.value = value;
    }

    /**
     * Установка телефона
     */
    set phone(value: string) {
        this._phone.value = value;
    }

    /**
     * Рендеринг формы контактов
     */
    render(data?: Partial<IContactsFormData>): HTMLElement {
        super.render(data);
        if (data?.email !== undefined) {
            this.email = data.email;
        }
        if (data?.phone !== undefined) {
            this.phone = data.phone;
        }
        return this.container;
    }
}