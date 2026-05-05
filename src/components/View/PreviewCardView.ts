import { CatalogPreviewCardView } from './CatalogPreviewCardView';
import { ICardData } from './CardView';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

/**
 * Класс для превью карточки товара
 */
export class PreviewCardView extends CatalogPreviewCardView {
    protected _description: HTMLElement;
    protected _inBasket: boolean = false;
    protected _isDisabled: boolean = false;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button.addEventListener('click', () => {
            const product = this.getProduct();
            if (product && !this._isDisabled) {
                if (this._inBasket) {
                    this.events.emit('product:remove-from-basket', { product });
                } else {
                    this.events.emit('product:add-to-basket', { product });
                }
                this.events.emit('modal:close');
            }
        });
    }

    /**
     * Рендеринг превью карточки
     */
    render(data?: Partial<ICardData & { inBasket: boolean; disabled: boolean }>): HTMLElement {
        super.render(data);
        if (data?.product) {
            this._description.textContent = data.product.description;
        }
        if (data?.disabled !== undefined) {
            this._isDisabled = data.disabled;
        }
        if (data?.inBasket !== undefined) {
            this._inBasket = data.inBasket;
        }
        this.setButtonState(this._inBasket, this._isDisabled);
        return this.container;
    }
}