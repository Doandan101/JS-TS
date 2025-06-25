// This file defines the data types and interfaces needed for the application.

export interface Contact {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export interface ContactService {
    addContact(contact: Contact): Promise<Contact>;
    deleteContact(id: string): Promise<boolean>;
    searchContacts(query: string): Promise<Contact[]>;
}