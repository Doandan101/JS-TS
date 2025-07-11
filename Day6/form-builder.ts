// ===== 1. KIỂU DỮ LIỆU NÂNG CAO - UNION, INTERSECTION, TYPE NARROWING =====

// Định nghĩa các kiểu field cơ bản
interface BaseField {
    name: string;
    label: string;
    required?: boolean;
    placeholder?: string;
}

interface TextField extends BaseField {
    type: 'text';
    value: string;
    minLength?: number;
    maxLength?: number;
}

interface NumberField extends BaseField {
    type: 'number';
    value: number;
    min?: number;
    max?: number;
    step?: number;
}

interface CheckboxField extends BaseField {
    type: 'checkbox';
    value: boolean;
}

interface SelectField extends BaseField {
    type: 'select';
    value: string;
    options: readonly { readonly value: string; readonly label: string }[];
}

// Union type cho tất cả các field
type FormField = TextField | NumberField | CheckboxField | SelectField;

// ===== 2. GENERICS CƠ BẢN → NÂNG CAO =====

// Type để lấy giá trị của field
type FieldValue<T extends FormField> = T extends TextField
    ? string
    : T extends NumberField
    ? number
    : T extends CheckboxField
    ? boolean
    : T extends SelectField
    ? string
    : never;

// Type để tạo form values từ array field - Cải thiện type inference
type FormValues<T extends readonly FormField[]> = {
    [K in T[number]['name']]: Extract<T[number], { name: K }> extends infer Field
        ? Field extends FormField
            ? FieldValue<Field>
            : never
        : never;
};

// ===== 3. UTILITY TYPES =====

// Validator type
type Validator<T> = (value: T) => string | null;

// Map validator theo field name
type ValidatorMap<T extends Record<string, any>> = Partial<{
    [K in keyof T]: Validator<T[K]>;
}>;

// Error messages
type ErrorMap<T extends Record<string, any>> = Partial<Record<keyof T, string>>;

// Pick một số field
type PickFields<T extends readonly FormField[], K extends T[number]['name']> = Extract<T[number], { name: K }>;

// Omit field khỏi form
type OmitFields<T extends readonly FormField[], K extends T[number]['name']> = Exclude<T[number], { name: K }>;

// ===== 4. INFER, CONDITIONAL TYPES =====

// Infer value type từ field config
type InferFieldValue<T> = T extends { value: infer V } ? V : never;

// Conditional type để determine field type
type FieldType<T extends FormField> = T extends TextField
    ? 'text'
    : T extends NumberField
    ? 'number'
    : T extends CheckboxField
    ? 'checkbox'
    : T extends SelectField
    ? 'select'
    : never;

// Advanced conditional type cho validation
type RequiredFields<T extends readonly FormField[]> = {
    [K in keyof T]: T[K] extends FormField
        ? T[K]['required'] extends true
            ? T[K]['name']
            : never
        : never;
}[keyof T];

// ===== 5. CLASS FORM BUILDER CHÍNH =====

class FormBuilder<T extends readonly FormField[]> {
    private fields: T;
    private values: FormValues<T>;
    private errors: ErrorMap<FormValues<T>>;
    private validators: ValidatorMap<FormValues<T>>;
    private onChange?: (values: FormValues<T>) => void;

    constructor(fields: T) {
        this.fields = fields;
        this.values = this.initializeValues();
        this.errors = {};
        this.validators = {};
    }

    // Khởi tạo giá trị mặc định
    private initializeValues(): FormValues<T> {
        const values: any = {};
        
        this.fields.forEach(field => {
            values[field.name] = field.value;
        });

        return values as FormValues<T>;
    }

    // Type narrowing để render field
    private renderField(field: FormField): string {
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
                // TypeScript sẽ biết đây là never type
                const exhaustiveCheck: never = field;
                throw new Error(`Unknown field type: ${exhaustiveCheck}`);
        }
    }

    private renderTextField(field: TextField): string {
        const error = this.errors[field.name as keyof FormValues<T>];
        return `
            <div class="field">
                <label for="${field.name}">
                    ${field.label} ${field.required ? '*' : ''}
                </label>
                <input 
                    type="text" 
                    id="${field.name}"
                    name="${field.name}"
                    value="${this.values[field.name as keyof FormValues<T>] || ''}"
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

    private renderNumberField(field: NumberField): string {
        const error = this.errors[field.name as keyof FormValues<T>];
        return `
            <div class="field">
                <label for="${field.name}">
                    ${field.label} ${field.required ? '*' : ''}
                </label>
                <input 
                    type="number" 
                    id="${field.name}"
                    name="${field.name}"
                    value="${this.values[field.name as keyof FormValues<T>] || ''}"
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

    private renderCheckboxField(field: CheckboxField): string {
        const error = this.errors[field.name as keyof FormValues<T>];
        return `
            <div class="field">
                <div class="checkbox-field">
                    <input 
                        type="checkbox" 
                        id="${field.name}"
                        name="${field.name}"
                        ${this.values[field.name as keyof FormValues<T>] ? 'checked' : ''}
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

    private renderSelectField(field: SelectField): string {
        const error = this.errors[field.name as keyof FormValues<T>];
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
                            this.values[field.name as keyof FormValues<T>] === option.value ? 'selected' : ''
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
    setValue<K extends keyof FormValues<T>>(fieldName: K, value: FormValues<T>[K]): void {
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
    getValue<K extends keyof FormValues<T>>(fieldName: K): FormValues<T>[K] {
        return this.values[fieldName];
    }

    // Set validator cho field với type inference tốt hơn
    setValidator<K extends T[number]['name']>(
        fieldName: K, 
        validator: Validator<Extract<T[number], { name: K }> extends FormField ? FieldValue<Extract<T[number], { name: K }>> : never>
    ): void {
        this.validators[fieldName as keyof FormValues<T>] = validator as any;
    }

    // Set onChange handler
    setOnChange(handler: (values: FormValues<T>) => void): void {
        this.onChange = handler;
    }

    // Validate toàn bộ form
    validateForm(): boolean {
        this.errors = {};
        let isValid = true;

        this.fields.forEach(field => {
            const fieldName = field.name as keyof FormValues<T>;
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
                const textField = field as TextField;
                const textValue = value as string;
                
                if (textValue && textField.minLength && textValue.length < textField.minLength) {
                    this.errors[fieldName] = `${field.label} phải có ít nhất ${textField.minLength} ký tự`;
                    isValid = false;
                }
                
                if (textValue && textField.maxLength && textValue.length > textField.maxLength) {
                    this.errors[fieldName] = `${field.label} không được vượt quá ${textField.maxLength} ký tự`;
                    isValid = false;
                }
            }

            if (field.type === 'number') {
                const numberField = field as NumberField;
                const numberValue = value as number;
                
                if (numberValue !== undefined && numberField.min !== undefined && numberValue < numberField.min) {
                    this.errors[fieldName] = `${field.label} phải lớn hơn hoặc bằng ${numberField.min}`;
                    isValid = false;
                }
                
                if (numberValue !== undefined && numberField.max !== undefined && numberValue > numberField.max) {
                    this.errors[fieldName] = `${field.label} phải nhỏ hơn hoặc bằng ${numberField.max}`;
                    isValid = false;
                }
            }

            // Custom validator
            const validator = this.validators[fieldName];
            if (validator && value !== undefined && value !== null) {
                const error = validator(value as any);
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
    resetForm(): void {
        this.values = this.initializeValues();
        this.errors = {};
        this.render();
        this.updateOutput();
        this.showStatus('Form đã được reset!', true);
    }

    // Get all values
    getValues(): FormValues<T> {
        this.updateOutput();
        return this.values;
    }

    // Render form
    render(): void {
        const container = document.getElementById('form-container');
        if (container) {
            container.innerHTML = this.fields.map(field => this.renderField(field)).join('');
        }
    }

    // Update output display
    private updateOutput(): void {
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
                validationStatus: Object.keys(this.errors).length === 0 ? 'Valid' : 'Invalid'
            };
            
            output.textContent = JSON.stringify(formattedOutput, null, 2);
        }
    }

    // Show status message
    private showStatus(message: string, isSuccess: boolean): void {
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

// ===== 6. DEMO CONFIGURATION =====

// Cấu hình form mẫu
const demoFields: readonly FormField[] = [
    {
        type: 'text' as const,
        name: 'fullName',
        label: 'Họ và tên',
        value: '',
        required: true,
        minLength: 2,
        maxLength: 50,
        placeholder: 'Nhập họ và tên'
    },
    {
        type: 'text' as const,
        name: 'email',
        label: 'Email',
        value: '',
        required: true,
        placeholder: 'example@email.com'
    },
    {
        type: 'number' as const,
        name: 'age',
        label: 'Tuổi',
        value: 0,
        required: true,
        min: 18,
        max: 100,
        step: 1
    },
    {
        type: 'select' as const,
        name: 'country',
        label: 'Quốc gia',
        value: '',
        required: true,
        options: [
            { value: 'vn', label: 'Việt Nam' },
            { value: 'us', label: 'Hoa Kỳ' },
            { value: 'jp', label: 'Nhật Bản' },
            { value: 'kr', label: 'Hàn Quốc' }
        ] as const
    },
    {
        type: 'checkbox' as const,
        name: 'agreeTerms',
        label: 'Tôi đồng ý với điều khoản sử dụng',
        value: false,
        required: true
    }
] as const;

// Global instance
let formBuilder: FormBuilder<typeof demoFields>;

// Khởi tạo demo
function initializeDemo() {
    formBuilder = new FormBuilder(demoFields);
    
    // Set custom validators
    formBuilder.setValidator('email', (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return value && !emailRegex.test(value) ? 'Email không hợp lệ' : null;
    });
    
    formBuilder.setValidator('fullName', (value: string) => {
        return value && value.trim().split(' ').length < 2 ? 'Vui lòng nhập đầy đủ họ và tên' : null;
    });

    // Set onChange handler
    formBuilder.setOnChange((values) => {
        console.log('Form values changed:', values);
    });

    // Render form
    formBuilder.render();
}

// Export cho global scope
(window as any).formBuilder = {
    setValue: (name: string, value: any) => formBuilder.setValue(name as any, value),
    getValue: (name: string) => formBuilder.getValue(name as any),
    validateForm: () => formBuilder.validateForm(),
    resetForm: () => formBuilder.resetForm(),
    getValues: () => formBuilder.getValues(),
    initializeDemo: initializeDemo
};

// ===== 7. TYPE DEMONSTRATIONS =====

// Demo các utility types
type DemoFormValues = FormValues<typeof demoFields>;
type DemoValidators = ValidatorMap<DemoFormValues>;
type DemoErrors = ErrorMap<DemoFormValues>;

// Demo pick và omit
type NameAndEmail = PickFields<typeof demoFields, 'fullName' | 'email'>;
type WithoutAge = OmitFields<typeof demoFields, 'age'>;

// Demo conditional types
type RequiredFieldsDemo = RequiredFields<typeof demoFields>;

console.log('🎯 Form Builder Type-Safe System initialized!');
console.log('📝 Available field types:', demoFields.map(f => f.type));
console.log('🔧 TypeScript magic in action! Check the form and output panel.');
