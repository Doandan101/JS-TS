export class Course {
    #id;
    constructor(name) {
        this.#id = `course-${Math.random().toString(36).substr(2, 9)}`;
        this.name = name;
        this.students = [];
    }

    get id() {
        return this.#id;
    }

    enrollStudent(student) {
        this.students.push(student);
    }

    getInfo() {
        return `${this.name} (ID: ${this.#id})`;
    }

    static countStudents(courses) {
        return courses.reduce((total, course) => total + course.students.length, 0);
    }
}

export class LiveCourse extends Course {
    constructor(name, zoomLink) {
        super(name);
        this.zoomLink = zoomLink;
    }

    getInfo() {
        return `${super.getInfo()} - Live (Zoom: ${this.zoomLink})`;
    }
}

export class RecordedCourse extends Course {
    constructor(name, duration) {
        super(name);
        this.duration = duration;
    }

    getInfo() {
        return `${super.getInfo()} - Recorded (${this.duration} minutes)`;
    }
}