import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

/**
 * Интерфейс данных для формы
 */
export interface IFormData {
    valid: boolean;
    errors: string[];
}

/**
 * Базовый класс для форм
 */
export abstract class FormView extends Component<IFormData> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._submit = container.querySelector('.button[type="submit"]') as HTMLButtonElement;
        this._errors = container.querySelector('.form__errors') as HTMLElement;

        this._submit.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.events.emit('form:submit', {});
        });
    }

    /**
     * Установка состояния валидности формы
     */
    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    /**
     * Установка ошибок формы
     */
    set errors(value: string[]) {
        this._errors.textContent = value.join('; ');
    }

    /**
     * Рендеринг формы
     */
    render(data?: Partial<IFormData>): HTMLElement {
        if (data?.valid !== undefined) {
            this.valid = data.valid;
        }
        if (data?.errors) {
            this.errors = data.errors;
        }
        return this.container;
    }
}