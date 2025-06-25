"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactController_1 = __importDefault(require("../controllers/contactController"));
const contactService_1 = __importDefault(require("../services/contactService"));
const router = (0, express_1.Router)();
const contactController = new contactController_1.default(contactService_1.default);
const setRoutes = () => {
    router.post('/contacts', contactController.addContact.bind(contactController));
    router.delete('/contacts/:email', contactController.deleteContact.bind(contactController));
    router.get('/contacts/search', contactController.searchContacts.bind(contactController));
    router.put('/contacts/:email', contactController.updateContact.bind(contactController));
    return router;
};
exports.default = setRoutes;
