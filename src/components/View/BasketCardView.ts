import { CardView, ICardData } from './CardView';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

/**
 * Класс для карточки товара в корзине
 */
export class BasketCardView extends CardView {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        events: IEvents,
        protected onDelete?: () => void
    ) {
        super(container, events);

        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        this._deleteButton.addEventListener('click', () => {
            if (this.onDelete) {
                this.onDelete();
            }
        });
    }

    /**
     * Установка индекса товара в корзине
     */
    set index(value: number) {
        this._index.textContent = value.toString();
    }

    /**
     * Рендеринг карточки корзины
     */
    render(data?: Partial<ICardData & { index: number }>): HTMLElement {
        super.render(data);
        if (data?.index !== undefined) {
            this.index = data.index;
        }
        return this.container;
    }
}