import { IBuyer, TPayment } from '../../types/index';

export class Buyer {
    payment: TPayment | null = null;
    email: string = '';
    phone: string = '';
    address: string = '';

    setPayment(payment: TPayment): void {
        this.payment = payment;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    setPhone(phone: string): void {
        this.phone = phone;
    }

    setAddress(address: string): void {
        this.address = address;
    }

    getData(): IBuyer {
        return {
            payment: this.payment as TPayment, // Предполагаем, что payment установлен
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
    }

    validate(): Record<string, string> {
        const errors: Record<string, string> = {};
        if (!this.payment) errors.payment = 'Не выбран вид оплаты';
        if (!this.email) errors.email = 'Укажите email';
        if (!this.phone) errors.phone = 'Укажите телефон';
        if (!this.address) errors.address = 'Укажите адрес';
        return errors;
    }
}