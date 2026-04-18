import './scss/styles.scss';
import { ProductsCatalog } from './components/Models/ProductsCatalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { apiProducts } from './utils/data';

// Тестирование моделей данных

// ProductsCatalog
const productsModel = new ProductsCatalog();
productsModel.setProducts(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getProducts());

const product = productsModel.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390');
console.log('Товар по id:', product);

productsModel.setPreview(apiProducts.items[0]);
console.log('Товар для превью:', productsModel.getPreview());

// Basket
const basketModel = new Basket();
basketModel.addItem(apiProducts.items[0]);
basketModel.addItem(apiProducts.items[1]);
console.log('Товары в корзине:', basketModel.getItems());
console.log('Общая стоимость:', basketModel.getTotal());
console.log('Количество товаров:', basketModel.getCount());
console.log('Есть ли товар в корзине:', basketModel.hasItem('854cef69-976d-4c2a-a18c-2aa45046c390'));

basketModel.removeItem(apiProducts.items[0]);
console.log('После удаления:', basketModel.getItems());

basketModel.clear();
console.log('После очистки:', basketModel.getItems());

// Buyer
const buyerModel = new Buyer();
buyerModel.setEmail('test@example.com');
buyerModel.setPhone('1234567890');
buyerModel.setAddress('Test Address');
buyerModel.setPayment('card');
console.log('Данные покупателя:', buyerModel.getData());

console.log('Валидация:', buyerModel.validate());

buyerModel.clear();
console.log('После очистки:', buyerModel.getData());
console.log('Валидация после очистки:', buyerModel.validate());

// Работа с сервером
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/Api/WebLarekApi';
import { API_URL } from './utils/constants';

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

webLarekApi.getProducts().then(data => {
    productsModel.setProducts(data.items);
    console.log('Каталог товаров с сервера:', productsModel.getProducts());
}).catch(err => console.error('Ошибка загрузки товаров:', err));
