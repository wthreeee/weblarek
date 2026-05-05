import { CatalogPreviewCardView } from './CatalogPreviewCardView';
import { ICardData } from './CardView';
import { IEvents } from '../base/Events';

/**
 * Класс для карточки товара в каталоге
 */
export class CatalogCardView extends CatalogPreviewCardView {
    constructor(
        container: HTMLElement,
        events: IEvents,
        protected onSelectClick?: () => void
    ) {
        super(container, events);

        this.container.addEventListener('click', () => {
            if (this.onSelectClick) {
                this.onSelectClick();
            }
        });
    }

    /**
     * Рендеринг карточки каталога
     */
    render(data?: Partial<ICardData & { inBasket: boolean; disabled: boolean }>): HTMLElement {
        super.render(data);
        if (data?.disabled !== undefined || data?.inBasket !== undefined) {
            this.setButtonState(data?.inBasket ?? false, data?.disabled ?? false);
        }
        return this.container;
    }
}