"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
class ContactService {
    constructor() {
        this.contacts = [];
    }
    addContact(contact) {
        if (this.isDuplicate(contact)) {
            return 'Contact already exists.';
        }
        this.contacts.push(contact);
        return 'Contact added successfully.';
    }
    deleteContact(id) {
        const index = this.contacts.findIndex(contact => contact.id === id);
        if (index === -1) {
            return 'Contact not found.';
        }
        this.contacts.splice(index, 1);
        return 'Contact deleted successfully.';
    }
    searchContacts(query) {
        const normalize = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const q = normalize(query);
        return this.contacts.filter(c => normalize(c.name).includes(q) ||
            normalize(c.email).includes(q));
    }
    getContacts() {
        return this.contacts;
    }
    isDuplicate(contact) {
        return this.contacts.some(existingContact => existingContact.email === contact.email);
    }
    updateContact(email, data) {
        const contact = this.contacts.find(c => c.email === email);
        if (!contact)
            return 'Contact not found.';
        contact.name = data.name;
        contact.phone = data.phone;
        return 'Contact updated successfully.';
    }
}
exports.ContactService = ContactService;
exports.default = new ContactService();
