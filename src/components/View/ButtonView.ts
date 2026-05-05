import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

/**
 * Интерфейс данных для кнопки
 */
export interface IButtonData {
    text: string;
    disabled: boolean;
}

/**
 * Класс для кнопки
 */
export class ButtonView extends Component<IButtonData> {
    protected _button: HTMLButtonElement;

    constructor(container: HTMLButtonElement, protected events: IEvents) {
        super(container);

        this._button = container;
        this._button.addEventListener('click', () => {
            this.events.emit('button:click');
        });
    }

    /**
     * Установка текста кнопки
     */
    set text(value: string) {
        this._button.textContent = value;
    }

    /**
     * Установка состояния кнопки
     */
    set disabled(value: boolean) {
        this._button.disabled = value;
    }

    /**
     * Рендеринг кнопки
     */
    render(data?: Partial<IButtonData>): HTMLElement {
        if (data?.text) {
            this.text = data.text;
        }
        if (data?.disabled !== undefined) {
            this.disabled = data.disabled;
        }
        return this.container;
    }
}