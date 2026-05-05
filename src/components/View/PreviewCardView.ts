import { CardView, ICardData } from './CardView';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

/**
 * Класс для превью карточки товара
 */
export class PreviewCardView extends CardView {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);
        this._button.addEventListener('click', () => {
            if (this._button.textContent !== 'Недоступно') {
                this.events.emit('product:add-to-basket', { product: this.product });
                this.events.emit('modal:close');
            }
        });
    }

    /**
     * Установка состояния кнопки
     */
    set inBasket(value: boolean) {
        this._button.disabled = value;
        this._button.textContent = value ? 'В корзине' : 'В корзину';
    }

    /**
     * Рендеринг превью карточки
     */
    render(data?: Partial<ICardData & { inBasket: boolean; disabled: boolean }>): HTMLElement {
        super.render(data);
        if (data?.product) {
            this._description.textContent = data.product.description;
        }
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