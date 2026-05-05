import { IProduct } from '../../types/index';
import { EventEmitter, IEvents } from '../base/Events';

export class ProductsCatalog {
    private products: IProduct[] = [];
    private preview: IProduct | null = null;

    constructor(private readonly events: IEvents = new EventEmitter()) {
    }

    setProducts(products: IProduct[]): void {
        this.products = products;
        this.events.emit('catalog:products-set', { products });
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id);
    }

    setPreview(product: IProduct): void {
        this.preview = product;
        this.events.emit('catalog:preview-set', { product });
    }

    getPreview(): IProduct | null {
        return this.preview;
    }
}