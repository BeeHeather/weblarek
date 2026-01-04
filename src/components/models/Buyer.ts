import { IBuyer, BuyerValidationErrors, TPayment } from "../../types";
import { EventEmitter } from "../base/Events";

export class Buyer {
  private payment: TPayment | null;
  private email: string;
  private phone: string;
  private address: string;
  protected events: EventEmitter;

  constructor(events: EventEmitter) {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
    this.events = events;
  }

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
      this.events.emit('buyer:changed');
    }
    if (data.email !== undefined) {
      this.email = data.email;
      this.events.emit('buyer:changed');
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
      this.events.emit('buyer:changed');
    }
    if (data.address !== undefined) {
      this.address = data.address;
      this.events.emit('buyer:changed');
    }
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
    this.events.emit('buyer:changed', this.getData());
  }

  validate(): BuyerValidationErrors {
    const errors: BuyerValidationErrors = {};
    if (!this.payment) {
      errors.payment = "Не выбран способ оплаты";
    }
    if (!this.email) {
      errors.email = "Укажите email";
    }
    if (!this.phone) {
      errors.phone = "Укажите телефон";
    }
    if (!this.address) {
      errors.address = "Укажите адрес";
    }
    return errors;
  }
}
