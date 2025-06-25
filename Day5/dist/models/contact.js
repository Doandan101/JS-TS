"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateContact = validateContact;
function validateContact(contact) {
    return validateEmail(contact.email) && validatePhone(contact.phone);
}
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function validatePhone(phone) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
}
