import { Router } from 'express';
import ContactController from '../controllers/contactController';
import contactService from '../services/contactService';

const router = Router();
const contactController = new ContactController(contactService);

const setRoutes = () => {
    router.post('/contacts', contactController.addContact.bind(contactController));
    router.delete('/contacts/:email', contactController.deleteContact.bind(contactController));
    router.get('/contacts/search', contactController.searchContacts.bind(contactController));
    router.put('/contacts/:email', contactController.updateContact.bind(contactController));
    return router;
};

export default setRoutes;