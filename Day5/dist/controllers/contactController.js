"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class ContactController {
    constructor(contactService) {
        this.contactService = contactService;
    }
    addContact(req, res) {
        const { name, email, phone } = req.body;
        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const id = Date.now().toString();
        const result = this.contactService.addContact({ id, name, email, phone });
        if (result === 'Contact added successfully.') {
            res.status(201).json({ id, name, email, phone });
        }
        else {
            res.status(400).json({ error: result });
        }
    }
    deleteContact(req, res) {
        const { email } = req.params;
        const result = this.contactService.deleteContact(email);
        if (result === 'Contact deleted successfully.') {
            res.status(204).send();
        }
        else {
            res.status(404).json({ error: result });
        }
    }
    searchContacts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query } = req.query;
            const results = yield this.contactService.searchContacts(query);
            res.status(200).json(results);
        });
    }
    updateContact(req, res) {
        const { email } = req.params;
        const { name, phone } = req.body;
        const result = this.contactService.updateContact(email, { name, phone });
        if (result === 'Contact updated successfully.') {
            res.status(200).json({ email, name, phone });
        }
        else {
            res.status(404).json({ error: result });
        }
    }
}
exports.default = ContactController;
