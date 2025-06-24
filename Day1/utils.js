export const generateId = () => `id-${Math.random().toString(36).substr(2, 9)}`;

export const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('vi-VN', options);
};

export const safeAccess = (obj, path) => {
    return path.reduce((current, key) => current?.[key], obj);
};