import { Contact } from '../models/contact';

export class ContactService {
    private contacts: Contact[] = [];

    addContact(contact: Contact): string {
        if (this.isDuplicate(contact)) {
            return 'Contact already exists.';
        }
        this.contacts.push(contact);
        return 'Contact added successfully.';
    }

    deleteContact(id: string): string {
        const index = this.contacts.findIndex(contact => contact.id === id);
        if (index === -1) {
            return 'Contact not found.';
        }
        this.contacts.splice(index, 1);
        return 'Contact deleted successfully.';
    }

    searchContacts(query: string) {
        const normalize = (str: string) =>
            str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const q = normalize(query);
        return this.contacts.filter(
            c =>
                normalize(c.name).includes(q) ||
                normalize(c.email).includes(q)
        );
    }

    public getContacts(): Contact[] {
        return this.contacts;
    }

    private isDuplicate(contact: Contact): boolean {
        return this.contacts.some(existingContact => existingContact.email === contact.email);
    }

    updateContact(email: string, data: { name: string, phone: string }) {
        const contact = this.contacts.find(c => c.email === email);
        if (!contact) return 'Contact not found.';
        contact.name = data.name;
        contact.phone = data.phone;
        return 'Contact updated successfully.';
    }
}

export default new ContactService();