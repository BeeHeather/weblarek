import "./scss/styles.scss";

import { IOrder, TPayment, IProduct, IOrderResponse } from "./types";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { Cart } from "./components/models/Cart";
import { Buyer } from "./components/models/Buyer";
import { Api } from "./components/base/Api";
import { StoreApi } from "./components/base/StoreApi";
import { API_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/Events";
import { ensureElement, cloneTemplate } from "./utils/utils";
import { Header } from "./components/views/Header";
import { Gallery } from "./components/views/Gallery";
import { Modal } from "./components/views/Modal";
import { Basket } from "./components/views/Basket";
import { Success } from "./components/views/Success";
import { OrderForm } from "./components/views/forms/OrdersForm";
import { ContactsForm } from "./components/views/forms/ContactsForm";
import { CatalogCard } from "./components/views/cards/CatalogCard";
import { BasketCard } from "./components/views/cards/BasketCard";
import { PreviewCard } from "./components/views/cards/PreviewCard";

const api = new StoreApi(new Api(API_URL));
const events = new EventEmitter();
const productModel = new ProductCatalog(events);
const basketModel = new Cart(events);
const buyerModel = new Buyer(events);

const header = new Header(events, ensureElement<HTMLElement>(".header"));
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const modal = new Modal(events, ensureElement<HTMLElement>("#modal-container"));
const successModal = new Success(events, cloneTemplate("#success"));
const basket = new Basket(events, cloneTemplate("#basket"));
const orderForm = new OrderForm(events, cloneTemplate("#order"));
const contactsForm = new ContactsForm(events, cloneTemplate("#contacts"));

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");

// Каталог товаров
events.on("catalog:changed", () => {
  const products = productModel.getItems();
  const cards = products.map((product) => {
    const card = new CatalogCard(cloneTemplate(cardCatalogTemplate), {
      onClick: () => {
        events.emit("catalog:card:select", product);
      }
    });
    return card.render(product);
  });
  
  gallery.render({ items: cards });
});

events.on("catalog:card:select", (product: IProduct) => {
  productModel.setPreviewItem(product);
});

events.on("product:selected", () => {
  const product = productModel.getPreviewItem();
  if (!product) return;

  const isInCart = basketModel.isItemInCart(product.id);
  const previewCard = new PreviewCard(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      events.emit("preview:add-to-cart", product);
    }
  });
  
  if (product.price === null) {
    previewCard.buttonText = "Недоступно";
    previewCard.buttonDisabled = true;
  } else if (isInCart) {
    previewCard.buttonText = "Уже в корзине";
    previewCard.buttonDisabled = true;
  } else {
    previewCard.buttonText = "В корзину";
    previewCard.buttonDisabled = false;
  }
  
  const cardElement = previewCard.render(product);

  modal.render({ content: cardElement });
  modal.open();
});

events.on("preview:add-to-cart", (product: IProduct) => {
  basketModel.addItem(product);
  modal.close();
});

// Корзина
events.on("basket:changed", () => {
  const products = basketModel.getItems();
  const total = basketModel.getTotalCost();
  const count = basketModel.getTotalCount();

  header.render({ counter: count });

  const basketCards = products.map((product, index) => {
    const card = new BasketCard(cloneTemplate(cardBasketTemplate), {
      onClick: () => {
        events.emit("basket:item:delete", product);
      }
    });
    card.index = index + 1;
    return card.render(product);
  });

  basket.render({
    items: basketCards,
    total: total,
    canCheckout: products.length > 0,
  });
});

// Открытие корзины
events.on("basket:open", () => {
  const products = basketModel.getItems();
  const total = basketModel.getTotalCost();
  const count = basketModel.getTotalCount();

  const basketCards = products.map((item, index) => {
    const card = new BasketCard(cloneTemplate(cardBasketTemplate), {
      onClick: () => {
        events.emit("basket:item:delete", item);
      }
    });
    card.index = index + 1;
    return card.render(item);
  });

  modal.render({ 
    content: basket.render({
      items: basketCards,
      total: total,
      canCheckout: count > 0
    })
  });
  modal.open();
});

events.on("basket:item:delete", (product: IProduct) => {
  basketModel.removeItem(product);
});

// Оформление заказа
events.on("order:set", () => {
  const buyerData = buyerModel.getData();
  const errors = buyerModel.validate();
  const isFormValid = !errors.payment && !errors.address;

  const orderErrors = {
    payment: errors.payment,
    address: errors.address
  } as Record<string, string>;

  const orderFormElement = orderForm.render({
    payment: buyerData.payment || "",
    address: buyerData.address || "",
    valid: isFormValid,
  });

  modal.render({ content: orderFormElement });

  orderForm.errors = orderErrors;
  orderForm.valid = isFormValid;
  modal.open();
});

// Изменение способа оплаты
events.on("order:payment:change", (data: { payment: TPayment }) => {
    buyerModel.setData({ payment: data.payment });
});
// Изменение адреса
events.on("order:address:change", (data: { address: string }) => {
  buyerModel.setData({ address: data.address });
});

events.on("buyer:changed", () => {
  const buyerData = buyerModel.getData();
  const errors = buyerModel.validate();
  const isFormValid = !errors.payment && !errors.address;

    const orderErrors = {
    payment: errors.payment,
    address: errors.address
  } as Record<string, string>;

  orderForm.payment = buyerData.payment || "";
  orderForm.address = buyerData.address || "";
  orderForm.errors = orderErrors;
  orderForm.valid = isFormValid;
});

// Отправка второй формы
events.on("contacts:set", () => {
  const buyerData = buyerModel.getData();
  const errors = buyerModel.validate();
  const isFormValid = !errors.email && !errors.phone;

  const contactsFormElement = contactsForm.render({
    email: buyerData.email || "",
    phone: buyerData.phone || "",
    valid: isFormValid,
  });

  modal.render({ content: contactsFormElement });

  contactsForm.errors = errors;
  contactsForm.valid = isFormValid;
  modal.open();
});

// Изменение контакных данных
events.on("contacts:change", (data: { email?: string; phone?: string }) => {
  buyerModel.setData(data);
  
  const errors = buyerModel.validate();
  const isFormValid = !errors.email && !errors.phone;

  contactsForm.email = data.email || "";
  contactsForm.phone = data.phone || "";
  contactsForm.errors = errors;
  contactsForm.valid = isFormValid;
});

// Отправка контактной формы
events.on("order:submit", () => {  
  const buyerData = buyerModel.getData();
  const errors = buyerModel.validate();
  const isFormValid = !errors.email && !errors.phone;

  const contactsFormElement = contactsForm.render({
    email: buyerData.email || "",
    phone: buyerData.phone || "",
    valid: isFormValid,
  });

  modal.render({ content: contactsFormElement });
  contactsForm.errors = errors;
  contactsForm.valid = isFormValid;
  modal.open();
});

events.on("contacts:submit", async (data: { email: string; phone: string }) => {  
  buyerModel.setData(data);
  const buyerData = buyerModel.getData();
  const basketItems = basketModel.getItems();

  try {
    const orderData: IOrder = {
      payment: buyerData.payment,
      email: buyerData.email,
      phone: buyerData.phone,
      address: buyerData.address,
      total: basketModel.getTotalCost(),
      items: basketItems.map((item) => item.id),
    };
    
    const response: IOrderResponse = await api.createOrder(orderData);
    successModal.render({ total: response.total });
    
    modal.render({ content: successModal.render() });
    basketModel.clear();
    buyerModel.clear();
  } catch (error) {
    console.error("Ошибка оформления заказа:", error);
    contactsForm.errors = {
      submit: "Ошибка оформления заказа. Попробуйте еще раз."
    };
  }
});

// Закрытие модальных окон
events.on("modal:close", () => {
  modal.close();
});

events.on("success:close", () => {
  modal.close();
});

// Инициализация товаров
try {
  const products = await api.getProducts();
  productModel.setItems(products);
} catch (error) {
  console.error("Ошибка загрузки товаров:", error);
}
