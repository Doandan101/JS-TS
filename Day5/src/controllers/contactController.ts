import { Request, Response } from 'express';
import ContactService from '../services/contactService';

class ContactController {
    contactService: any;

    constructor(contactService: typeof ContactService) {
        this.contactService = contactService;
    }

    addContact(req: Request, res: Response) {
        const { name, email, phone } = req.body;
        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const id = Date.now().toString();
        const result = this.contactService.addContact({ id, name, email, phone });
        if (result === 'Contact added successfully.') {
            res.status(201).json({ id, name, email, phone });
        } else {
            res.status(400).json({ error: result });
        }
    }

    deleteContact(req: Request, res: Response) {
        const { email } = req.params;
        const result = this.contactService.deleteContact(email);
        if (result === 'Contact deleted successfully.') {
            res.status(204).send();
        } else {
            res.status(404).json({ error: result });
        }
    }

    async searchContacts(req: Request, res: Response) {
        const { query } = req.query;
        const results = await this.contactService.searchContacts(query as string);
        res.status(200).json(results);
    }

    updateContact(req: Request, res: Response) {
        const { email } = req.params;
        const { name, phone } = req.body;
        const result = this.contactService.updateContact(email, { name, phone });
        if (result === 'Contact updated successfully.') {
            res.status(200).json({ email, name, phone });
        } else {
            res.status(404).json({ error: result });
        }
    }
}

export default ContactController;