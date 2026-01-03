import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected modalContent: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.modalContent = ensureElement<HTMLElement>(
      ".modal__content",
      this.container
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container
    );

    this.closeButton.addEventListener("click", () => {
      events.emit("modal:close");
    });

    // Закрытие по клику вне модального окна
    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        events.emit("modal:close");
      }
    });

    // Закрытие по escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.close();
        events.emit("modal:close");
      }
    });
  }

  render(data?: IModal): HTMLElement {
    if (data && data.content) {
      this.modalContent.replaceChildren(data.content);
    }
    return this.container;
  }

  open() {
    this.container.classList.add("modal_active");
  }

  close() {
    this.container.classList.remove("modal_active");
  }
}
