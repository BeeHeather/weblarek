import "./scss/styles.scss";

import { IOrder, TPayment } from "./types";
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
    const card = new CatalogCard(cloneTemplate(cardCatalogTemplate));
    const renderedCard = card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.image,
    });

    renderedCard.addEventListener("click", () => {
      const isInCart = basketModel.isItemInCart(product.id);
      const previewCard = new PreviewCard(cloneTemplate(cardPreviewTemplate));
      const cardElement = previewCard.render({
        title: product.title,
        price: product.price,
        category: product.category,
        image: product.image,
        description: product.description || "",
      });

      previewCard.buttonText = isInCart ? "Уже в корзине" : "В корзину";
      previewCard.buttonDisabled = isInCart || product.price === null;

      if (!isInCart && product.price !== null) {
        const addButton = cardElement.querySelector(".card__button");
        if (addButton) {
          addButton.addEventListener("click", () => {
            basketModel.addItem(product);
            modal.close();
          });
        }
      }

      modal.render({ content: cardElement });
      modal.open();
    });

    return renderedCard;
  });

  gallery.render({ items: cards });
});

// Корзина
events.on("basket:changed", () => {
  const products = basketModel.getItems();
  const total = basketModel.getTotalCost();
  const count = basketModel.getTotalCount();

  header.render({ counter: count });

  const basketCards = products.map((product, index) => {
    const card = new BasketCard(cloneTemplate(cardBasketTemplate));
    const renderedCard = card.render({
      title: product.title,
      price: product.price,
    });

    card.index = index + 1;

    const deleteButton = renderedCard.querySelector(".basket__item-delete");
    if (deleteButton) {
      deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        basketModel.removeItem(product);
      });
    }

    return renderedCard;
  });

  basket.render({
    items: basketCards,
    total: total,
    canCheckout: products.length > 0,
  });
});

// Открытие корзины
events.on("basket:open", () => {
  const basketElement = basket.render();
  modal.render({ content: basketElement });
  modal.open();
});

// Оформление заказа
events.on("order:set", () => {
  const buyerData = buyerModel.getData();
  const errors = buyerModel.validate();
  const isFormValid = !errors.payment && !errors.address;

  const orderFormElement = orderForm.render({
    payment: buyerData.payment || "",
    address: buyerData.address || "",
    valid: isFormValid,
  });

  modal.render({ content: orderFormElement });

  orderForm.errors = errors;
  orderForm.valid = isFormValid;
});

// Изменение способа оплаты
events.on("order:payment:change", (data: { payment: string }) => {
  let payment: TPayment | undefined = undefined;

  if (data.payment === "card") {
    payment = "online";
  } else if (data.payment === "cash") {
    payment = "cash";
  }

  buyerModel.setData({ payment });
  orderForm.payment = data.payment;

  const errors = buyerModel.validate();
  const isFormValid = !errors.payment && !errors.address;

  orderForm.errors = errors;
  orderForm.valid = isFormValid;
});

// Изменение адреса
events.on("order:address:change", (data: { address: string }) => {
  buyerModel.setData({ address: data.address });

  const errors = buyerModel.validate();
  const isFormValid = !errors.payment && !errors.address;

  orderForm.errors = errors;
  orderForm.valid = isFormValid;
});

// Отправка первой формы
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
});

// Изменение контакных данных
events.on("contacts:change", (data: { email?: string; phone?: string }) => {
  buyerModel.setData(data);

  const errors = buyerModel.validate();
  const isFormValid = !errors.email && !errors.phone;

  contactsForm.errors = errors;
  contactsForm.valid = isFormValid;
});

// Отправка контактной формы
events.on("contacts:submit", () => {
  const errors = buyerModel.validate();

  if (Object.keys(errors).length === 0) {
    const buyerData = buyerModel.getData();
    const basketItems = basketModel.getItems();

    const orderData: IOrder = {
      payment: buyerData.payment,
      email: buyerData.email,
      phone: buyerData.phone,
      address: buyerData.address,
      total: basketModel.getTotalCost(),
      items: basketItems.map((item) => item.id),
    };

    api
      .createOrder(orderData)
      .then(() => {
        const successElement = successModal.render({
          total: basketModel.getTotalCost(),
        });

        modal.render({ content: successElement });
        basketModel.clear();
        buyerModel.clear();
      })
      .catch((error: Error) => {
        console.error("Ошибка оформления заказа:", error);
        contactsForm.errors = {
          submit: "Ошибка оформления заказа. Попробуйте еще раз.",
        };
      });
  } else {
    contactsForm.errors = errors;
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
