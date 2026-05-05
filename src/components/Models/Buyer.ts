import { IBuyer, TPayment, TBuyerErrors } from '../../types/index';
import { EventEmitter, IEvents } from '../base/Events';

export class Buyer {
    private payment: TPayment | null = null;
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    constructor(private readonly events: IEvents = new EventEmitter()) {
    }

    setPayment(payment: TPayment): void {
        this.payment = payment;
        this.emitChange('buyer:payment-change', { payment });
    }

    setEmail(email: string): void {
        this.email = email;
        this.emitChange('buyer:email-change', { email });
    }

    setPhone(phone: string): void {
        this.phone = phone;
        this.emitChange('buyer:phone-change', { phone });
    }

    setAddress(address: string): void {
        this.address = address;
        this.emitChange('buyer:address-change', { address });
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }

    clear(): void {
        this.payment = null;
        this.email = '';
        this.phone = '';
        this.address = '';
        this.emitChange('buyer:cleared', {});
    }

    validate(): TBuyerErrors {
        const errors: TBuyerErrors = {};
        if (!this.payment) errors.payment = 'Не выбран вид оплаты';
        if (!this.email) errors.email = 'Укажите email';
        if (!this.phone) errors.phone = 'Укажите телефон';
        if (!this.address) errors.address = 'Укажите адрес';
        return errors;
    }

    private emitChange(eventName: string, data: object) {
        this.events.emit(eventName, {
            ...data,
            buyer: this.getData()
        });
    }
}