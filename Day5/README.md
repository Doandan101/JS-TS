# Smart Contact Manager

## Giới thiệu
Smart Contact Manager là một ứng dụng quản lý danh bạ thông minh cho phép người dùng thêm, sửa, xóa và tìm kiếm danh bạ một cách dễ dàng. Ứng dụng có thể được triển khai dưới dạng giao diện dòng lệnh (CLI) hoặc giao diện web.

## Chức năng
- **Thêm danh bạ**: Người dùng có thể thêm thông tin liên lạc mới bao gồm tên, email và số điện thoại.
- **Sửa danh bạ**: Người dùng có thể cập nhật thông tin của danh bạ đã tồn tại.
- **Xóa danh bạ**: Người dùng có thể xóa danh bạ không còn cần thiết.
- **Tìm kiếm danh bạ**: Người dùng có thể tìm kiếm danh bạ theo tên, email hoặc số điện thoại.

## Cấu trúc dự án
Dự án được tổ chức theo cấu trúc thư mục sau:
```
smart-contact-manager
├── src
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── app.ts
│   └── types
├── public
│   └── index.html
├── tests
├── .github
│   └── workflows
├── .eslintrc.json
├── .prettierrc
├── jest.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## Cài đặt
1. Clone repository về máy của bạn:
   ```
   git clone <repository-url>
   ```
2. Di chuyển vào thư mục dự án:
   ```
   cd smart-contact-manager
   ```
3. Cài đặt các phụ thuộc:
   ```
   npm install
   ```

## Chạy ứng dụng
Để chạy ứng dụng, sử dụng lệnh sau:
```
npm start
```

## Kiểm tra
Để chạy các bài kiểm tra, sử dụng lệnh:
```
npm test
```

## CI/CD
Dự án đã được thiết lập CI pipeline với các bước linting, testing và formatting thông qua GitHub Actions. Các tệp cấu hình liên quan nằm trong thư mục `.github/workflows`.

## Tài liệu
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Jest](https://jestjs.io/)
- [TypeScript](https://www.typescriptlang.org/)