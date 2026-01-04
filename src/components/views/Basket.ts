import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasketData {
  total: number;
  items: HTMLElement[];
  canCheckout: boolean;
}

export class Basket extends Component<IBasketData> {
  protected basketButton: HTMLButtonElement;
  protected basketPrice: HTMLElement;
  protected basketList: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.basketButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container
    );
    this.basketPrice = ensureElement<HTMLElement>(
      ".basket__price",
      this.container
    );
    this.basketList = ensureElement<HTMLElement>(
      ".basket__list",
      this.container
    );

    this.basketButton.addEventListener("click", () => {
      this.events.emit("order:set");
    });
  }

  set total(value: number) {
    this.basketPrice.textContent = `${value} синапсов`;
  }

  set items(elements: HTMLElement[]) {
    this.basketList.innerHTML = "";

    if (elements && elements.length > 0) {
      this.basketList.append(...elements);
    }
  }

  set checkout(value: boolean) {
    this.basketButton.disabled = !value;
  }

  render(data?: IBasketData): HTMLElement {
    if (data) {
      if (data.total !== undefined) {
        this.total = data.total;
      }

      if (data.items !== undefined) {
        this.items = data.items;
      }

      if (data.canCheckout !== undefined) {
        this.checkout = data.canCheckout;
      }
    }
    return this.container;
  }
}
