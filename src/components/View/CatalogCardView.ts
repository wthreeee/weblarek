import { CatalogPreviewCardView } from './CatalogPreviewCardView';
import { ICardData } from './CardView';
import { IEvents } from '../base/Events';

/**
 * Класс для карточки товара в каталоге
 */
export class CatalogCardView extends CatalogPreviewCardView {
    protected _inBasket: boolean = false;
    protected _isDisabled: boolean = false;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._button.addEventListener('click', (event) => {
            event.stopPropagation();
            const product = this.getProduct();
            if (product && !this._isDisabled) {
                if (this._inBasket) {
                    this.events.emit('product:remove-from-basket', { product });
                } else {
                    this.events.emit('product:add-to-basket', { product });
                }
            }
        });

        this.container.addEventListener('click', (event) => {
            if (!(event.target as HTMLElement).closest('.card__button')) {
                const product = this.getProduct();
                if (product) {
                    this.events.emit('product:select', { product });
                }
            }
        });
    }

    /**
     * Рендеринг карточки каталога
     */
    render(data?: Partial<ICardData & { inBasket: boolean; disabled: boolean }>): HTMLElement {
        super.render(data);
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