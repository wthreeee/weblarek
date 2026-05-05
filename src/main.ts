import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { IProduct } from './types/index';
import { ProductsCatalog } from './components/Models/ProductsCatalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/Api/WebLarekApi';
import { API_URL } from './utils/constants';
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

let basketView: BasketView | null = null;
let previewView: PreviewCardView | null = null;
let orderFormView: OrderFormView | null = null;
let contactsFormView: ContactsFormView | null = null;
let successView: OrderSuccessView | null = null;
let currentModalMode: 'preview' | 'basket' | 'order' | 'contacts' | 'success' | null = null;

const renderCatalog = () => {
  const cards = productsModel.getProducts().map((product) => {
    const cardContainer = cloneTemplate<HTMLElement>('#card-catalog');
    const card = new CatalogCardView(cardContainer, emitter);
    card.render({ product, inBasket: basketModel.hasItem(product.id), disabled: product.price === null });
    return cardContainer;
  });

  galleryView.render({ items: cards });
};

const renderHeader = () => {
  headerView.render({ counter: basketModel.getCount() });
};

const renderPreview = () => {
  const product = productsModel.getPreview();
  if (!product) {
    return;
  }

  previewView = new PreviewCardView(cloneTemplate<HTMLElement>('#card-preview'), emitter);
  previewView.render({ product, inBasket: basketModel.hasItem(product.id), disabled: product.price === null });

  modalView.render({ content: previewView.render({ product, inBasket: basketModel.hasItem(product.id), disabled: product.price === null }) });
  modalView.isActive = true;
  currentModalMode = 'preview';
};

const renderBasket = () => {
  const items = basketModel.getItems().map((product, index) => {
    const itemContainer = cloneTemplate<HTMLElement>('#card-basket');
    const itemCard = new BasketCardView(itemContainer, emitter);
    itemCard.render({ product, index: index + 1 });
    return itemContainer;
  });

  basketView = new BasketView(cloneTemplate<HTMLElement>('#basket'), emitter);
  basketView.render({ items, total: basketModel.getTotal(), isEmpty: items.length === 0 });
  modalView.render({ content: basketView.render({ items, total: basketModel.getTotal(), isEmpty: items.length === 0 }) });
  modalView.isActive = true;
  currentModalMode = 'basket';
};

const renderOrderForm = () => {
  if (!orderFormView || currentModalMode !== 'order') {
    orderFormView = new OrderFormView(cloneTemplate<HTMLElement>('#order'), emitter);
  }

  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();
  const container = orderFormView.render({
    valid: !errors.payment && !errors.address,
    errors: [errors.payment, errors.address].filter(Boolean) as string[],
    payment: buyer.payment ?? 'online',
    address: buyer.address,
  });

  modalView.render({ content: container });
  modalView.isActive = true;
  currentModalMode = 'order';
};

const renderContactsForm = () => {
  if (!contactsFormView || currentModalMode !== 'contacts') {
    contactsFormView = new ContactsFormView(cloneTemplate<HTMLElement>('#contacts'), emitter);
  }

  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();
  const container = contactsFormView.render({
    valid: !errors.email && !errors.phone,
    errors: [errors.email, errors.phone].filter(Boolean) as string[],
    email: buyer.email,
    phone: buyer.phone,
  });

  modalView.render({ content: container });
  modalView.isActive = true;
  currentModalMode = 'contacts';
};

const renderSuccess = () => {
  successView = new OrderSuccessView(cloneTemplate<HTMLElement>('#success'), emitter);
  successView.render({ total: basketModel.getTotal() });

  modalView.render({ content: successView.render({ total: basketModel.getTotal() }) });
  modalView.isActive = true;
  currentModalMode = 'success';
};

emitter.on('catalog:products-set', () => {
  renderCatalog();
});

emitter.on('catalog:preview-set', () => {
  renderPreview();
});

emitter.on('basket:change', () => {
  renderHeader();
  renderCatalog();
  if (currentModalMode === 'basket') {
    renderBasket();
  }
  if (currentModalMode === 'preview') {
    renderPreview();
  }
});

emitter.on('buyer:payment-change', () => {
  if (currentModalMode === 'order') {
    renderOrderForm();
  }
});

emitter.on('buyer:address-change', () => {
  if (currentModalMode === 'order') {
    renderOrderForm();
  }
});

emitter.on('buyer:email-change', () => {
  if (currentModalMode === 'contacts') {
    renderContactsForm();
  }
});

emitter.on('buyer:phone-change', () => {
  if (currentModalMode === 'contacts') {
    renderContactsForm();
  }
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
  renderBasket();
});

emitter.on('order:start', () => {
  renderOrderForm();
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

emitter.on('form:submit', () => {
  if (currentModalMode === 'order') {
    const errors = buyerModel.validate();
    const orderErrors = [errors.payment, errors.address].filter(Boolean) as string[];

    if (orderErrors.length > 0) {
      orderFormView?.render({ valid: false, errors: orderErrors });
      return;
    }

    renderContactsForm();
    return;
  }

  if (currentModalMode === 'contacts') {
    const errors = buyerModel.validate();
    const contactErrors = [errors.email, errors.phone].filter(Boolean) as string[];

    if (contactErrors.length > 0) {
      contactsFormView?.render({ valid: false, errors: contactErrors });
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
        basketModel.clear();
        buyerModel.clear();
      })
      .catch((err) => {
        console.error('Ошибка отправки заказа:', err);
      });
  }
});

emitter.on('modal:close', () => {
  modalView.isActive = false;
  currentModalMode = null;
});

emitter.on('order:success-close', () => {
  modalView.isActive = false;
  currentModalMode = null;
});

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

webLarekApi.getProducts()
  .then((data) => {
    productsModel.setProducts(data.items);
  })
  .catch(() => {
    // Handle error silently or show user-friendly message
  });

renderHeader();
