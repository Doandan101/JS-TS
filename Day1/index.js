import { Course, LiveCourse, RecordedCourse } from './course.js';
import { Student } from './student.js';
import { generateId, formatDate, safeAccess } from './utils.js';

// Closure để quản lý khóa học
function createCourseManager() {
    const courses = []; // Private scope
    let courseCount = 0; // TDZ minh họa

    return {
        addCourse: (course) => {
            courses.push(course);
            courseCount++;
            console.log(`Đã thêm khóa học: ${course.getInfo()}`);
        },
        updateCourse: (courseId, updatedData) => {
            const courseIndex = courses.findIndex(c => c.id === courseId);
            if (courseIndex === -1) {
                throw new Error('Khóa học không tồn tại');
            }
            const existingCourse = courses[courseIndex];
            // Sử dụng spread để giữ các thuộc tính cũ
            const updatedCourse = {
                ...existingCourse,
                ...updatedData,
                // Giữ danh sách học viên
                students: [...existingCourse.students]
            };
            // Tạo instance mới dựa trên loại khóa học
            let newCourse;
            if (existingCourse instanceof LiveCourse) {
                const { name, zoomLink } = updatedCourse;
                newCourse = new LiveCourse(name, zoomLink);
            } else if (existingCourse instanceof RecordedCourse) {
                const { name, duration } = updatedCourse;
                newCourse = new RecordedCourse(name, duration);
            } else {
                const { name } = updatedCourse;
                newCourse = new Course(name);
            }
            newCourse.students = updatedCourse.students;
            courses[courseIndex] = newCourse;
            console.log(`Đã cập nhật khóa học: ${newCourse.getInfo()}`);
        },
        getCourses: () => [...courses],
        getCourseCount: () => courseCount,
        getCourseById: (id) => courses.find(c => c.id === id)
    };
}

const courseManager = createCourseManager();

// Hàm đăng ký học viên với Promise và async/await
async function registerStudentToCourse(student, course) {
    return new Promise((resolve, reject) => {
        console.log(`Bắt đầu đăng ký: ${student.getInfo()} vào ${course.getInfo()}`);
        setTimeout(() => {
            const randomError = Math.random() > 0.8;
            if (randomError) {
                console.error('Lỗi ngẫu nhiên xảy ra!');
                reject(new Error('Đăng ký thất bại do lỗi hệ thống'));
            } else {
                course.enrollStudent(student);
                console.log(`Hoàn tất đăng ký: ${student.getInfo()}`);
                resolve('Đăng ký thành công');
            }
        }, 1000); // Mô phỏng delay
    });
}

// Xử lý giao diện
document.addEventListener('DOMContentLoaded', () => {
    const courseForm = document.getElementById('courseForm');
    const studentForm = document.getElementById('studentForm');
    const registerForm = document.getElementById('registerForm');
    const courseList = document.getElementById('courseList');
    const studentList = document.getElementById('studentList');
    const studentSelect = document.getElementById('studentSelect');
    const courseSelect = document.getElementById('courseSelect');
    const courseType = document.getElementById('courseType');
    const liveCourseFields = document.getElementById('liveCourseFields');
    const recordedCourseFields = document.getElementById('recordedCourseFields');
    const courseFormTitle = document.getElementById('courseFormTitle');
    const courseFormButton = document.getElementById('courseFormButton');
    const editCourseId = document.getElementById('editCourseId');

    const students = [];

    // Hiển thị/ẩn fields theo loại khóa học
    courseType.addEventListener('change', () => {
        liveCourseFields.classList.add('hidden');
        recordedCourseFields.classList.add('hidden');
        if (courseType.value === 'LiveCourse') {
            liveCourseFields.classList.remove('hidden');
        } else if (courseType.value === 'RecordedCourse') {
            recordedCourseFields.classList.remove('hidden');
        }
    });

    // Thêm hoặc sửa khóa học
    courseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const { value: name } = document.getElementById('courseName');
        const type = courseType.value;
        const courseId = editCourseId.value;

        let courseData;
        if (type === 'LiveCourse') {
            const { value: zoomLink } = document.getElementById('zoomLink');
            courseData = { name, zoomLink };
        } else if (type === 'RecordedCourse') {
            const { value: duration } = document.getElementById('duration');
            courseData = { name, duration: parseInt(duration) };
        } else {
            courseData = { name };
        }

        try {
            if (courseId) {
                // Sửa khóa học
                courseManager.updateCourse(courseId, courseData);
                courseFormTitle.textContent = 'Thêm Khóa học';
                courseFormButton.textContent = 'Thêm';
                editCourseId.value = '';
            } else {
                // Thêm khóa học
                let course;
                if (type === 'LiveCourse') {
                    course = new LiveCourse(name, courseData.zoomLink);
                } else if (type === 'RecordedCourse') {
                    course = new RecordedCourse(name, courseData.duration);
                } else {
                    course = new Course(name);
                }
                courseManager.addCourse(course);
            }
            updateCourseList();
            updateCourseSelect();
            courseForm.reset();
            courseType.dispatchEvent(new Event('change')); // Reset fields ẩn/hiện
        } catch (error) {
            alert(error.message);
        }
    });

    // Thêm học viên
    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const { value: name } = document.getElementById('studentName');
        const { value: email } = document.getElementById('studentEmail');
        const student = new Student(name, email);
        students.push(student);
        updateStudentList();
        updateStudentSelect();
        studentForm.reset();
    });

    // Đăng ký khóa học
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const studentId = studentSelect.value;
        const courseId = courseSelect.value;
        const student = students.find(s => s.id === studentId);
        const course = courseManager.getCourses().find(c => c.id === courseId);

        try {
            await registerStudentToCourse(student, course);
            alert('Đăng ký thành công!');
        } catch (error) {
            alert(error.message);
        }
    });

    // Cập nhật danh sách khóa học
    function updateCourseList() {
        courseList.innerHTML = '';
        courseManager.getCourses().forEach(course => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors';
            row.innerHTML = `
                <td class="py-2 px-4 border-b">${course.name}</td>
                <td class="py-2 px-4 border-b">
                    <button class="text-blue-500 hover:underline" onclick="editCourse('${course.id}')">Sửa</button>
                </td>
            `;
            courseList.appendChild(row);
        });
    }

    // Cập nhật danh sách học viên
    function updateStudentList() {
        studentList.innerHTML = '';
        students.forEach(student => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors';
            row.innerHTML = `
                <td class="py-2 px-4 border-b">${student.name}</td>
                <td class="py-2 px-4 border-b">${student.email}</td>
            `;
            studentList.appendChild(row);
        });
    }

    // Cập nhật select học viên
    function updateStudentSelect() {
        studentSelect.innerHTML = '';
        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = student.getInfo();
            studentSelect.appendChild(option);
        });
    }

    // Cập nhật select khóa học
    function updateCourseSelect() {
        courseSelect.innerHTML = '';
        courseManager.getCourses().forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.getInfo();
            courseSelect.appendChild(option);
        });
    }

    // Hàm chỉnh sửa khóa học (di chuyển từ event listener vào đây)
    window.editCourse = (courseId) => {
        const course = courseManager.getCourseById(courseId);
        const { name } = course;
        const isLiveCourse = course instanceof LiveCourse;
        const isRecordedCourse = course instanceof RecordedCourse;
        document.getElementById('courseName').value = name;
        courseType.value = isLiveCourse ? 'LiveCourse' : isRecordedCourse ? 'RecordedCourse' : 'Course';
        courseType.dispatchEvent(new Event('change')); // Cập nhật fields ẩn/hiện
        if (isLiveCourse) {
            document.getElementById('zoomLink').value = safeAccess(course, ['zoomLink']) ?? '';
        } else if (isRecordedCourse) {
            document.getElementById('duration').value = safeAccess(course, ['duration']) ?? '';
        }
        editCourseId.value = course.id;
        courseFormTitle.textContent = 'Sửa Khóa học';
        courseFormButton.textContent = 'Cập nhật';
    };

    // Đăng ký nhiều học viên cùng lúc
    async function registerMultipleStudents(students, course) {
        const promises = students.map(student => registerStudentToCourse(student, course));
        try {
            const results = await Promise.all(promises);
            console.log('Kết quả đăng ký hàng loạt:', results);
        } catch (error) {
            console.error('Lỗi đăng ký hàng loạt:', error);
        }
    }

    // Ví dụ sử dụng
    const student1 = new Student('Nguyen Van A', 'a@example.com');
    const student2 = new Student('Tran Thi B', 'b@example.com');
    students.push(student1, student2);
    const course = new Course('JavaScript Cơ bản');
    courseManager.addCourse(course);
    updateCourseList();
    updateStudentList();
    updateCourseSelect();
    updateStudentSelect();

    // Minh họa spread và update email
    const updatedStudent = Student.updateEmail(student1, 'new@example.com');
    console.log('Học viên sau khi thay đổi email:', updatedStudent);

    // Minh họa đăng ký nhiều học viên
    registerMultipleStudents([student1, student2], course);
});