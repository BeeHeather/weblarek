import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

export interface IOrderFormData {
  payment: string;
  address: string;
  valid: boolean;
}

export class OrderForm extends Form<IOrderFormData> {
  protected paymentButtons: NodeListOf<HTMLButtonElement>;
  protected addressInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(container, ".order__button");

    this.paymentButtons = this.container.querySelectorAll(".button_alt");
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container
    );

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const payment = button.getAttribute("name");
        if (payment) {
          events.emit("order:payment:change", { payment });
        }
      });
    });

    this.addressInput.addEventListener("input", () => {
      events.emit("order:address:change", { address: this.addressInput.value });
    });

    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      events.emit("order:submit");
    });
  }

  set payment(value: string) {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle(
        "button_alt-active",
        button.getAttribute("name") === value
      );
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
