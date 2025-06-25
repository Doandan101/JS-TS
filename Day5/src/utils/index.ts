// src/utils/index.ts

export function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

export function normalizePhoneNumber(phone: string): string {
    return phone.replace(/\D/g, '');
}

export function isDuplicate(contactList: Array<{ name: string; email: string; phone: string }>, newContact: { name: string; email: string; phone: string }): boolean {
    return contactList.some(contact => 
        contact.email === newContact.email || contact.phone === newContact.phone
    );
}