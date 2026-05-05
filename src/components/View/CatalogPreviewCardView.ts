import { CardView, ICardData } from './CardView';
import { IEvents } from '../base/Events';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

/**
 * Промежуточный класс для карточек каталога и превью
 * Содержит общий функционал для карточек с категорией и кнопкой
 */
export abstract class CatalogPreviewCardView extends CardView {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _button: HTMLButtonElement | null;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._button = container.querySelector('.card__button');
    }

    /**
     * Установка состояния кнопки
     */
    protected setButtonState(inBasket: boolean, disabled: boolean) {
        if (!this._button) {
            return;
        }

        this._button.disabled = disabled;
        
        if (disabled) {
            this._button.textContent = 'Недоступно';
        } else if (inBasket) {
            this._button.textContent = 'Удалить';
        } else {
            this._button.textContent = 'В корзину';
        }
    }

    /**
     * Рендеринг карточки с изображением и категорией
     */
    render(data?: Partial<ICardData>): HTMLElement {
        if (data?.product) {
            this.setImage(this._image, data.product.image, data.product.title);
            this._category.textContent = data.product.category;
            this._category.className = `card__category ${categoryMap[data.product.category] || 'card__category_other'}`;
        }
        return super.render(data);
    }
}
