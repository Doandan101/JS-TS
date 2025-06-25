export interface Contact {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export function validateContact(contact: Contact): boolean {
    return validateEmail(contact.email) && validatePhone(contact.phone);
}

function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
}