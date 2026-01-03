import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

export abstract class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsContainer: HTMLElement;

  constructor(
    container: HTMLElement,
    submitButtonSelector: string = ".order__button"
  ) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      submitButtonSelector,
      this.container
    );
    this.errorsContainer = ensureElement<HTMLElement>(
      ".form__errors",
      this.container
    );
  }

  set errors(value: Record<string, string>) {
    if (value) {
      const errorMessages = Object.values(value).filter((msg) => msg);
      this.errorsContainer.textContent = errorMessages.join(", ");
    }
  }

  clearErrors() {
    this.errorsContainer.textContent = "";
  }

  set valid(value: boolean) {
    if (this.submitButton) {
      this.submitButton.disabled = !value;
    }
  }
}
