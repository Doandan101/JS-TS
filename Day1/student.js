export class Student {
    #id;
    #email;

    constructor(name, email) {
        this.#id = `student-${Math.random().toString(36).substr(2, 9)}`;
        this.name = name;
        this.#email = email;
    }

    get id() {
        return this.#id;
    }

    get email() {
        return this.#email;
    }

    set email(newEmail) {
        if (newEmail.includes('@')) {
            this.#email = newEmail;
        } else {
            throw new Error('Email không hợp lệ');
        }
    }

    getInfo() {
        return `${this.name} (${this.#email})`;
    }

    static updateEmail(student, newEmail) {
        const { ...updatedStudent } = { ...student, email: newEmail };
        return updatedStudent;
    }
}