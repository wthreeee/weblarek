import { CardView, ICardData } from './CardView';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

/**
 * Класс для карточки товара в каталоге
 */
export class CatalogCardView extends CardView {
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._button = ensureElement<HTMLButtonElement>('.card__button', container);
        this._button.addEventListener('click', (event) => {
            event.stopPropagation();
            this.events.emit('product:add-to-basket', { product: this.product });
        });

        this.container.addEventListener('click', (event) => {
            if (!(event.target as HTMLElement).closest('.card__button')) {
                this.events.emit('product:select', { product: this.product });
            }
        });
    }

    /**
     * Установка состояния кнопки (добавлен в корзину или нет)
     */
    set inBasket(value: boolean) {
        this._button.disabled = value;
        this._button.textContent = value ? 'В корзине' : 'В корзину';
    }

    /**
     * Рендеринг карточки каталога
     */
    render(data?: Partial<ICardData & { inBasket: boolean; disabled: boolean }>): HTMLElement {
        super.render(data);
        if (data?.inBasket !== undefined) {
            this.inBasket = data.inBasket;
        }
        if (data?.disabled) {
            this._button.disabled = true;
            this._button.textContent = 'Недоступно';
        } else if (!data?.inBasket) {
            this._button.disabled = false;
            this._button.textContent = 'В корзину';
        }
        return this.container;
    }
}