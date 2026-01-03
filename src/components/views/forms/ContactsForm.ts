import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

export interface IContactsFormData {
  email: string;
  phone: string;
  valid: boolean;
  errors?: Record<string, string>;
}

export class ContactsForm extends Form<IContactsFormData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(container, ".button");

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container
    );

    this.emailInput.addEventListener("input", () => {
      events.emit("contacts:change", {
        email: this.emailInput.value,
        phone: this.phoneInput.value,
      });
    });

    this.phoneInput.addEventListener("input", () => {
      events.emit("contacts:change", {
        email: this.emailInput.value,
        phone: this.phoneInput.value,
      });
    });

    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      events.emit("contacts:submit", {
        email: this.emailInput.value,
        phone: this.phoneInput.value,
      });
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
