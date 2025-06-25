import { ContactService } from '../src/services/contactService';
import ContactController from '../src/controllers/contactController';

    let contactService: ContactService;
    let contactController: ContactController;

    beforeEach(() => {
        contactService = new ContactService();
        contactController = new ContactController(contactService);
    });

    test('should add a contact', () => {
        const req: any = { body: { name: 'John Doe', email: 'john@example.com', phone: '1234567890' } };
        const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        contactController.addContact(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalled();
    });

    test('should delete a contact', () => {
        const addReq: any = { body: { name: 'Jane Doe', email: 'jane@example.com', phone: '0987654321' } };
        const addRes: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        contactController.addContact(addReq, addRes);

        const id = contactService.getContacts()[0]?.id || '1';
        const req: any = { params: { id } };
        const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };
        contactController.deleteContact(req, res);
        expect(res.status).toHaveBeenCalled();
    });

    test('should search for contacts', () => {
        const addReq: any = { body: { name: 'John Doe', email: 'john@example.com', phone: '1234567890' } };
        const addRes: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        contactController.addContact(addReq, addRes);

        const req: any = { query: { query: 'John' } };
        const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        contactController.searchContacts(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalled();
    });


