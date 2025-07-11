// ===== COMPILED JAVASCRIPT FROM TYPESCRIPT =====

// Định nghĩa các kiểu field cơ bản
class FormBuilder {
    constructor(fields) {
        this.fields = fields;
        this.values = this.initializeValues();
        this.errors = {};
        this.validators = {};
    }

    // Khởi tạo giá trị mặc định
    initializeValues() {
        const values = {};
        
        this.fields.forEach(field => {
            values[field.name] = field.value;
        });

        return values;
    }

    // Type narrowing để render field
    renderField(field) {
        switch (field.type) {
            case 'text':
                return this.renderTextField(field);
            case 'number':
                return this.renderNumberField(field);
            case 'checkbox':
                return this.renderCheckboxField(field);
            case 'select':
                return this.renderSelectField(field);
            default:
                throw new Error(`Unknown field type: ${field.type}`);
        }
    }

    renderTextField(field) {
        const error = this.errors[field.name];
        return `
            <div class="field">
                <label for="${field.name}">
                    ${field.label} ${field.required ? '*' : ''}
                </label>
                <input 
                    type="text" 
                    id="${field.name}"
                    name="${field.name}"
                    value="${this.values[field.name] || ''}"
                    placeholder="${field.placeholder || ''}"
                    ${field.minLength ? `minlength="${field.minLength}"` : ''}
                    ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}
                    ${field.required ? 'required' : ''}
                    onchange="formBuilder.setValue('${field.name}', this.value)"
                />
                ${error ? `<div class="error">${error}</div>` : ''}
            </div>
        `;
    }

    renderNumberField(field) {
        const error = this.errors[field.name];
        return `
            <div class="field">
                <label for="${field.name}">
                    ${field.label} ${field.required ? '*' : ''}
                </label>
                <input 
                    type="number" 
                    id="${field.name}"
                    name="${field.name}"
                    value="${this.values[field.name] || ''}"
                    placeholder="${field.placeholder || ''}"
                    ${field.min !== undefined ? `min="${field.min}"` : ''}
                    ${field.max !== undefined ? `max="${field.max}"` : ''}
                    ${field.step ? `step="${field.step}"` : ''}
                    ${field.required ? 'required' : ''}
                    onchange="formBuilder.setValue('${field.name}', parseFloat(this.value) || 0)"
                />
                ${error ? `<div class="error">${error}</div>` : ''}
            </div>
        `;
    }

    renderCheckboxField(field) {
        const error = this.errors[field.name];
        return `
            <div class="field">
                <div class="checkbox-field">
                    <input 
                        type="checkbox" 
                        id="${field.name}"
                        name="${field.name}"
                        ${this.values[field.name] ? 'checked' : ''}
                        onchange="formBuilder.setValue('${field.name}', this.checked)"
                    />
                    <label for="${field.name}">
                        ${field.label} ${field.required ? '*' : ''}
                    </label>
                </div>
                ${error ? `<div class="error">${error}</div>` : ''}
            </div>
        `;
    }

    renderSelectField(field) {
        const error = this.errors[field.name];
        return `
            <div class="field">
                <label for="${field.name}">
                    ${field.label} ${field.required ? '*' : ''}
                </label>
                <select 
                    id="${field.name}"
                    name="${field.name}"
                    ${field.required ? 'required' : ''}
                    onchange="formBuilder.setValue('${field.name}', this.value)"
                >
                    <option value="">-- Chọn ${field.label} --</option>
                    ${field.options.map(option => `
                        <option value="${option.value}" ${
                            this.values[field.name] === option.value ? 'selected' : ''
                        }>
                            ${option.label}
                        </option>
                    `).join('')}
                </select>
                ${error ? `<div class="error">${error}</div>` : ''}
            </div>
        `;
    }

    // Generic setValue với type safety
    setValue(fieldName, value) {
        this.values[fieldName] = value;
        
        // Clear error khi user nhập
        if (this.errors[fieldName]) {
            delete this.errors[fieldName];
            this.render();
        }

        // Trigger onChange
        if (this.onChange) {
            this.onChange(this.values);
        }

        this.updateOutput();
    }

    // Generic getValue với type safety
    getValue(fieldName) {
        return this.values[fieldName];
    }

    // Set validator cho field
    setValidator(fieldName, validator) {
        this.validators[fieldName] = validator;
    }

    // Set onChange handler
    setOnChange(handler) {
        this.onChange = handler;
    }

    // Validate toàn bộ form
    validateForm() {
        this.errors = {};
        let isValid = true;

        this.fields.forEach(field => {
            const fieldName = field.name;
            const value = this.values[fieldName];
            
            // Validate required
            if (field.required) {
                if (value === undefined || value === null || value === '' || value === false) {
                    this.errors[fieldName] = `${field.label} là bắt buộc`;
                    isValid = false;
                    return;
                }
            }

            // Validate field-specific rules
            if (field.type === 'text') {
                const textValue = value;
                
                if (textValue && field.minLength && textValue.length < field.minLength) {
                    this.errors[fieldName] = `${field.label} phải có ít nhất ${field.minLength} ký tự`;
                    isValid = false;
                }
                
                if (textValue && field.maxLength && textValue.length > field.maxLength) {
                    this.errors[fieldName] = `${field.label} không được vượt quá ${field.maxLength} ký tự`;
                    isValid = false;
                }
            }

            if (field.type === 'number') {
                const numberValue = value;
                
                if (numberValue !== undefined && field.min !== undefined && numberValue < field.min) {
                    this.errors[fieldName] = `${field.label} phải lớn hơn hoặc bằng ${field.min}`;
                    isValid = false;
                }
                
                if (numberValue !== undefined && field.max !== undefined && numberValue > field.max) {
                    this.errors[fieldName] = `${field.label} phải nhỏ hơn hoặc bằng ${field.max}`;
                    isValid = false;
                }
            }

            // Custom validator
            const validator = this.validators[fieldName];
            if (validator && value !== undefined && value !== null) {
                const error = validator(value);
                if (error) {
                    this.errors[fieldName] = error;
                    isValid = false;
                }
            }
        });

        this.render();
        this.showStatus(isValid ? 'Form hợp lệ!' : 'Form có lỗi, vui lòng kiểm tra lại.', isValid);
        return isValid;
    }

    // Reset form
    resetForm() {
        this.values = this.initializeValues();
        this.errors = {};
        this.render();
        this.updateOutput();
        this.showStatus('Form đã được reset!', true);
    }

    // Get all values
    getValues() {
        this.updateOutput();
        return this.values;
    }

    // Render form
    render() {
        const container = document.getElementById('form-container');
        if (container) {
            container.innerHTML = this.fields.map(field => this.renderField(field)).join('');
        }
    }

    // Update output display
    updateOutput() {
        const output = document.getElementById('output-content');
        if (output) {
            const formattedOutput = {
                values: this.values,
                errors: Object.keys(this.errors).length > 0 ? this.errors : 'Không có lỗi',
                fieldTypes: this.fields.map(field => ({
                    name: field.name,
                    type: field.type,
                    required: field.required || false
                })),
                validationStatus: Object.keys(this.errors).length === 0 ? 'Valid' : 'Invalid',
                typeInformation: {
                    note: 'TypeScript types ensure type safety at compile time',
                    formValuesType: 'FormValues<T>',
                    validatorsType: 'ValidatorMap<FormValues<T>>',
                    errorsType: 'ErrorMap<FormValues<T>>'
                }
            };
            
            output.textContent = JSON.stringify(formattedOutput, null, 2);
        }
    }

    // Show status message
    showStatus(message, isSuccess) {
        const container = document.getElementById('status-container');
        if (container) {
            container.innerHTML = `
                <div class="status ${isSuccess ? 'success' : 'error'}">
                    ${message}
                </div>
            `;
            
            setTimeout(() => {
                container.innerHTML = '';
            }, 3000);
        }
    }
}

// ===== DEMO CONFIGURATION =====

// Cấu hình form mẫu
const demoFields = [
    {
        type: 'text',
        name: 'fullName',
        label: 'Họ và tên',
        value: '',
        required: true,
        minLength: 2,
        maxLength: 50,
        placeholder: 'Nhập họ và tên'
    },
    {
        type: 'text',
        name: 'email',
        label: 'Email',
        value: '',
        required: true,
        placeholder: 'example@email.com'
    },
    {
        type: 'number',
        name: 'age',
        label: 'Tuổi',
        value: 0,
        required: true,
        min: 18,
        max: 100,
        step: 1
    },
    {
        type: 'select',
        name: 'country',
        label: 'Quốc gia',
        value: '',
        required: true,
        options: [
            { value: 'vn', label: 'Việt Nam' },
            { value: 'us', label: 'Hoa Kỳ' },
            { value: 'jp', label: 'Nhật Bản' },
            { value: 'kr', label: 'Hàn Quốc' }
        ]
    },
    {
        type: 'checkbox',
        name: 'agreeTerms',
        label: 'Tôi đồng ý với điều khoản sử dụng',
        value: false,
        required: true
    }
];

// Global instance
let formBuilder;

// Khởi tạo demo
function initializeDemo() {
    formBuilder = new FormBuilder(demoFields);
    
    // Set custom validators
    formBuilder.setValidator('email', (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return value && !emailRegex.test(value) ? 'Email không hợp lệ' : null;
    });
    
    formBuilder.setValidator('fullName', (value) => {
        return value && value.trim().split(' ').length < 2 ? 'Vui lòng nhập đầy đủ họ và tên' : null;
    });

    // Set onChange handler
    formBuilder.setOnChange((values) => {
        console.log('Form values changed:', values);
    });

    // Render form
    formBuilder.render();
    
    // Show initial type information
    console.log('🎯 Form Builder Type-Safe System initialized!');
    console.log('📝 Available field types:', demoFields.map(f => f.type));
    console.log('🔧 TypeScript magic in action! Check the form and output panel.');
    console.log('📊 Type Safety Features:');
    console.log('   - Union Types: FormField = TextField | NumberField | CheckboxField | SelectField');
    console.log('   - Type Narrowing: switch (field.type) with exhaustive checking');
    console.log('   - Generics: FormBuilder<T extends readonly FormField[]>');
    console.log('   - Utility Types: Partial<T>, Pick<T,K>, Omit<T,K>, Record<K,V>');
    console.log('   - Conditional Types: FieldValue<T>, FormValues<T>');
    console.log('   - Infer: type InferFieldValue<T> = T extends { value: infer V } ? V : never');
}

// Export cho global scope
console.log('🔧 Setting up global formBuilder object...');

window.formBuilder = {
    setValue: (name, value) => {
        if (!formBuilder) throw new Error('Form chưa được khởi tạo');
        return formBuilder.setValue(name, value);
    },
    getValue: (name) => {
        if (!formBuilder) throw new Error('Form chưa được khởi tạo');
        return formBuilder.getValue(name);
    },
    validateForm: () => {
        if (!formBuilder) throw new Error('Form chưa được khởi tạo');
        return formBuilder.validateForm();
    },
    resetForm: () => {
        if (!formBuilder) throw new Error('Form chưa được khởi tạo');
        return formBuilder.resetForm();
    },
    getValues: () => {
        if (!formBuilder) throw new Error('Form chưa được khởi tạo');
        return formBuilder.getValues();
    },
    initializeDemo: initializeDemo
};

console.log('✅ Global formBuilder object set up successfully!');
console.log('📊 Available methods:', Object.keys(window.formBuilder));

// TypeScript Type Demonstrations (chỉ để documentation)
/*
=== TYPESCRIPT TYPE EXAMPLES ===

// 1. Union Types và Type Narrowing
type FormField = TextField | NumberField | CheckboxField | SelectField;

function renderField(field: FormField): string {
    switch (field.type) {
        case 'text': return renderTextField(field); // field is TextField
        case 'number': return renderNumberField(field); // field is NumberField  
        case 'checkbox': return renderCheckboxField(field); // field is CheckboxField
        case 'select': return renderSelectField(field); // field is SelectField
        default: 
            const exhaustiveCheck: never = field; // Exhaustive checking
            throw new Error(`Unknown field type`);
    }
}

// 2. Generics với Constraints
class FormBuilder<T extends readonly FormField[]> {
    setValue<K extends T[number]['name']>(
        fieldName: K, 
        value: FieldValue<Extract<T[number], { name: K }>>
    ): void { }
}

// 3. Utility Types
type FormValues<T> = {
    [K in T[number]['name']]: FieldValue<Extract<T[number], { name: K }>>
};
type ErrorMap<T> = Partial<Record<keyof T, string>>;
type ValidatorMap<T> = Partial<{[K in keyof T]: (value: T[K]) => string | null}>;

// 4. Conditional Types với Infer
type FieldValue<T> = T extends TextField ? string
    : T extends NumberField ? number
    : T extends CheckboxField ? boolean
    : T extends SelectField ? string
    : never;

type InferFieldValue<T> = T extends { value: infer V } ? V : never;

// 5. Advanced Type Manipulation
type RequiredFields<T extends readonly FormField[]> = {
    [K in keyof T]: T[K] extends FormField
        ? T[K]['required'] extends true ? T[K]['name'] : never
        : never;
}[keyof T];

type PickFields<T, K> = Extract<T[number], { name: K }>;
type OmitFields<T, K> = Exclude<T[number], { name: K }>;
*/
