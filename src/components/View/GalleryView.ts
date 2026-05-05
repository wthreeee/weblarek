import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

/**
 * Интерфейс данных для галереи
 */
export interface IGalleryData {
    items: HTMLElement[];
}

/**
 * Класс для галереи товаров
 */
export class GalleryView extends Component<IGalleryData> {
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
    }

    /**
     * Установка списка товаров
     */
    set items(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }

    /**
     * Рендеринг галереи
     */
    render(data?: Partial<IGalleryData>): HTMLElement {
        if (data?.items) {
            this.items = data.items;
        }
        return this.container;
    }
}