import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types/index';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

/**
 * Интерфейс данных для карточки товара
 */
export interface ICardData {
    product: IProduct;
}

/**
 * Базовый класс для карточек товара
 */
export abstract class CardView extends Component<ICardData> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _product: IProduct | null = null;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
    }

    /**
     * Товар карточки
     */
    get product(): IProduct {
        if (!this._product) {
            throw new Error('Product is not set for CardView');
        }
        return this._product;
    }

    /**
     * Установка данных карточки
     */
    set product(product: IProduct) {
        this._product = product;
        this.setImage(this._image, product.image, product.title);
        this._title.textContent = product.title;
        this._category.textContent = product.category;
        this._category.className = `card__category ${categoryMap[product.category] || 'card__category_other'}`;
        this._price.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';
    }

    /**
     * Рендеринг карточки
     */
    render(data?: Partial<ICardData>): HTMLElement {
        if (data?.product) {
            this.product = data.product;
        }
        return this.container;
    }
}