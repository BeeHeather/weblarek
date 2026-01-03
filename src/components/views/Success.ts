import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface ISuccessData {
  total: number;
}

export class Success extends Component<ISuccessData> {
  private description: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(container);

    this.description = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container
    );

    this.closeButton.addEventListener("click", () => {
      events.emit("success:close");
    });
  }

  set total(value: number) {
    this.description.textContent = `Списано ${value} синапсов`;
  }

  render(data?: ISuccessData): HTMLElement {
    if (data && data.total !== undefined) {
      this.total = data.total;
    }
    return this.container;
  }
}
