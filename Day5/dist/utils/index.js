"use strict";
// src/utils/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = validateEmail;
exports.normalizePhoneNumber = normalizePhoneNumber;
exports.isDuplicate = isDuplicate;
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}
function normalizePhoneNumber(phone) {
    return phone.replace(/\D/g, '');
}
function isDuplicate(contactList, newContact) {
    return contactList.some(contact => contact.email === newContact.email || contact.phone === newContact.phone);
}
