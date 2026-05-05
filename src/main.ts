import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { IProduct } from './types/index';
import { ProductsCatalog } from './components/Models/ProductsCatalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/Api/WebLarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { HeaderView } from './components/View/HeaderView';
import { GalleryView } from './components/View/GalleryView';
import { CatalogCardView } from './components/View/CatalogCardView';
import { BasketCardView } from './components/View/BasketCardView';
import { PreviewCardView } from './components/View/PreviewCardView';
import { BasketView } from './components/View/BasketView';
import { ModalView } from './components/View/ModalView';
import { OrderFormView } from './components/View/OrderFormView';
import { ContactsFormView } from './components/View/ContactsFormView';
import { OrderSuccessView } from './components/View/OrderSuccessView';

const emitter = new EventEmitter();

const productsModel = new ProductsCatalog(emitter);
const basketModel = new Basket(emitter);
const buyerModel = new Buyer(emitter);

const headerView = new HeaderView(ensureElement<HTMLElement>('.header'), emitter);
const galleryView = new GalleryView(ensureElement<HTMLElement>('.gallery'), emitter);
const modalView = new ModalView(ensureElement<HTMLElement>('.modal'), emitter);

// Представления создаются однократно
const basketView = new BasketView(cloneTemplate<HTMLElement>('#basket'), emitter);
const previewView = new PreviewCardView(cloneTemplate<HTMLElement>('#card-preview'), emitter, () => {
  const product = productsModel.getPreview();
  if (!product || product.price === null) {
    return;
  }

  if (basketModel.hasItem(product.id)) {
    basketModel.removeItem(product);
  } else {
    basketModel.addItem(product);
  }
});
const orderFormView = new OrderFormView(cloneTemplate<HTMLElement>('#order'), emitter);
const contactsFormView = new ContactsFormView(cloneTemplate<HTMLElement>('#contacts'), emitter);
const successView = new OrderSuccessView(cloneTemplate<HTMLElement>('#success'), emitter);

const catalogCards: CatalogCardView[] = [];
const buildImageUrl = (image: string): string => {
  return image.startsWith('http') ? image : `${CDN_URL}/${image.replace(/^\/+/, '')}`;
};

const createCatalogCards = () => {
  catalogCards.length = 0;
  const cards = productsModel.getProducts().map((product) => {
    const cardContainer = cloneTemplate<HTMLElement>('#card-catalog');
    const card = new CatalogCardView(cardContainer, emitter, () => {
      productsModel.setPreview(product);
    });
    card.render({ product, inBasket: basketModel.hasItem(product.id), disabled: product.price === null });
    catalogCards.push(card);
    return cardContainer;
  });

  galleryView.render({ items: cards });
};

const renderCatalog = () => {
  productsModel.getProducts().forEach((product, index) => {
    const card = catalogCards[index];
    if (!card) {
      return;
    }

    card.render({ product, inBasket: basketModel.hasItem(product.id), disabled: product.price === null });
  });
};

const renderHeader = () => {
  headerView.render({ counter: basketModel.getCount() });
};

const renderPreview = () => {
  const product = productsModel.getPreview();
  if (!product) {
    return;
  }

  previewView.render({ product, inBasket: basketModel.hasItem(product.id), disabled: product.price === null });
  modalView.render({ content: previewView.container });
  modalView.isActive = true;
};

const renderBasket = () => {
  const items = basketModel.getItems().map((product, index) => {
    const itemContainer = cloneTemplate<HTMLElement>('#card-basket');
    const itemCard = new BasketCardView(itemContainer, emitter, () => {
      basketModel.removeItem(product);
    });
    itemCard.render({ product, index: index + 1 });
    return itemContainer;
  });

  basketView.render({ items, total: basketModel.getTotal(), isEmpty: items.length === 0 });
};

const renderOrderForm = () => {
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();
  orderFormView.render({
    valid: !errors.payment && !errors.address,
    errors: [errors.payment, errors.address].filter(Boolean) as string[],
    payment: buyer.payment ?? 'online',
    address: buyer.address,
  });
};

const renderContactsForm = () => {
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();
  contactsFormView.render({
    valid: !errors.email && !errors.phone,
    errors: [errors.email, errors.phone].filter(Boolean) as string[],
    email: buyer.email,
    phone: buyer.phone,
  });
};

const renderSuccess = () => {
  successView.render({ total: basketModel.getTotal() });
};

emitter.on('catalog:products-set', () => {
  createCatalogCards();
});

emitter.on('catalog:preview-set', () => {
  renderPreview();
});

emitter.on('basket:change', () => {
  renderHeader();
  renderCatalog();
  renderBasket();
  renderPreview();
});

emitter.on('buyer:payment-change', () => {
  renderOrderForm();
});

emitter.on('buyer:address-change', () => {
  renderOrderForm();
});

emitter.on('buyer:email-change', () => {
  renderContactsForm();
});

emitter.on('buyer:phone-change', () => {
  renderContactsForm();
});

emitter.on<{ product: IProduct }>('product:add-to-basket', ({ product }) => {
  if (!basketModel.hasItem(product.id)) {
    basketModel.addItem(product);
  }
});

emitter.on<{ product: IProduct }>('product:remove-from-basket', ({ product }) => {
  basketModel.removeItem(product);
});

emitter.on<{ product: IProduct }>('product:select', ({ product }) => {
  productsModel.setPreview(product);
});

emitter.on('basket:open', () => {
  modalView.render({ content: basketView.container });
  modalView.isActive = true;
});

emitter.on('order:start', () => {
  renderOrderForm();
  modalView.render({ content: orderFormView.container });
  modalView.isActive = true;
});

emitter.on<{ payment: 'online' | 'cash' }>('order:payment-change', ({ payment }) => {
  buyerModel.setPayment(payment);
});

emitter.on<{ address: string }>('order:address-change', ({ address }) => {
  buyerModel.setAddress(address);
});

emitter.on<{ email: string }>('contacts:email-change', ({ email }) => {
  buyerModel.setEmail(email);
});

emitter.on<{ phone: string }>('contacts:phone-change', ({ phone }) => {
  buyerModel.setPhone(phone);
});

emitter.on('order:submit', () => {
  const orderErrors = [buyerModel.validate().payment, buyerModel.validate().address].filter(Boolean) as string[];
  
  if (orderErrors.length > 0) {
    renderOrderForm();
    return;
  }

  renderContactsForm();
  modalView.render({ content: contactsFormView.container });
  modalView.isActive = true;
});

emitter.on('contacts:submit', () => {
  const contactErrors = [buyerModel.validate().email, buyerModel.validate().phone].filter(Boolean) as string[];

  if (contactErrors.length > 0) {
    renderContactsForm();
    return;
  }

  const buyer = buyerModel.getData();
  const items = basketModel.getItems();
  const total = basketModel.getTotal();

  const orderRequest = {
    payment: buyer.payment as 'online' | 'cash',
    email: buyer.email,
    phone: buyer.phone,
    address: buyer.address,
    total,
    items: items.map((item) => item.id),
  };

  webLarekApi
    .createOrder(orderRequest)
    .then(() => {
      renderSuccess();
      modalView.render({ content: successView.container });
      modalView.isActive = true;
      basketModel.clear();
      buyerModel.clear();
    })
    .catch((err) => {
      console.error('Ошибка отправки заказа:', err);
    });
});

emitter.on('modal:close', () => {
  modalView.isActive = false;
});

emitter.on('order:success-close', () => {
  modalView.isActive = false;
});

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

webLarekApi.getProducts()
  .then((data) => {
    const productsWithCDN = data.items.map((product) => ({
      ...product,
      image: buildImageUrl(product.image),
    }));
    productsModel.setProducts(productsWithCDN);
  })
  .catch(() => {
    // Handle error silently or show user-friendly message
  });

renderHeader();
