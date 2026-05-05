import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types/index';
import { ensureElement } from '../../utils/utils';

/**
 * Интерфейс данных для карточки товара
 */
export interface ICardData {
    product: IProduct;
}

/**
 * Базовый класс для карточек товара
 * Содержит только общие поля для всех наследников: название и цена
 */
export abstract class CardView extends Component<ICardData> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
    }

    /**
     * Рендеринг карточки
     */
    render(data?: Partial<ICardData>): HTMLElement {
        if (data?.product) {
            this._title.textContent = data.product.title;
            this._price.textContent = data.product.price ? `${data.product.price} синапсов` : 'Бесценно';
        }
        return this.container;
    }
}