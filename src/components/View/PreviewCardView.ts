import { CatalogPreviewCardView } from './CatalogPreviewCardView';
import { ICardData } from './CardView';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

/**
 * Класс для превью карточки товара
 */
export class PreviewCardView extends CatalogPreviewCardView {
    protected _description: HTMLElement;
    protected _product: any;

    constructor(
        container: HTMLElement,
        events: IEvents,
        protected onButtonClick?: (productId: string) => void
    ) {
        super(container, events);

        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button?.addEventListener('click', () => {
            if (!this._button || this._button.disabled || !this.onButtonClick || !this._product) {
                return;
            }

            this.onButtonClick(this._product.id);
            this.events.emit('modal:close');
        });
    }

    /**
     * Рендеринг превью карточки
     */
    render(data?: Partial<ICardData & { inBasket: boolean; disabled: boolean }>): HTMLElement {
        super.render(data);
        if (data?.product) {
            this._product = data.product;
            this._description.textContent = data.product.description;
        }
        if (data?.disabled !== undefined || data?.inBasket !== undefined) {
            this.setButtonState(data?.inBasket ?? false, data?.disabled ?? false);
        }
        return this.container;
    }
}