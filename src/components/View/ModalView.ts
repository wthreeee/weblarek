import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

/**
 * Интерфейс данных для модального окна
 */
export interface IModalData {
    content: HTMLElement;
}

/**
 * Класс для модального окна
 */
export class ModalView extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        });

        this.container.addEventListener('click', () => {
            if (this.container.classList.contains('modal_active')) {
                this.events.emit('modal:close');
            }
        });

        this._content.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    /**
     * Установка видимости модального окна
     */
    set isActive(value: boolean) {
        this.container.classList.toggle('modal_active', value);
    }

    /**
     * Установка содержимого модального окна
     */
    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    /**
     * Рендеринг модального окна
     */
    render(data?: Partial<IModalData>): HTMLElement {
        if (data?.content) {
            this.content = data.content;
        }
        return this.container;
    }
}