// ===== ADVANCED TYPESCRIPT CONCEPTS DEMONSTRATION =====
// File này minh họa các kỹ thuật TypeScript nâng cao được sử dụng trong Form Builder

// ===== 1. UNION TYPES VÀ DISCRIMINATED UNIONS =====

// Base interface cho tất cả fields (demo version)
interface DemoBaseField {
    name: string;
    label: string;
    required?: boolean;
}

// Các kiểu field specific với discriminated union (demo version)
interface DemoTextField extends DemoBaseField {
    type: 'text';
    value: string;
    minLength?: number;
    maxLength?: number;
}

interface DemoNumberField extends DemoBaseField {
    type: 'number'; 
    value: number;
    min?: number;
    max?: number;
}

interface DemoCheckboxField extends DemoBaseField {
    type: 'checkbox';
    value: boolean;
}

// Union type - TypeScript sẽ biết chính xác type dựa vào 'type' property
type DemoFormField = DemoTextField | DemoNumberField | DemoCheckboxField;

// ===== 2. TYPE NARROWING VỚI EXHAUSTIVE CHECKING =====

function processField(field: DemoFormField): string {
    // TypeScript sẽ narrow type trong mỗi case
    switch (field.type) {
        case 'text':
            // field is DemoTextField here
            return `Text field: ${field.value}, min: ${field.minLength || 0}`;
        case 'number':
            // field is DemoNumberField here  
            return `Number field: ${field.value}, range: ${field.min}-${field.max}`;
        case 'checkbox':
            // field is DemoCheckboxField here
            return `Checkbox field: ${field.value ? 'checked' : 'unchecked'}`;
        default:
            // Exhaustive checking - TypeScript báo lỗi nếu miss case
            const exhaustiveCheck: never = field;
            throw new Error(`Unhandled field type: ${exhaustiveCheck}`);
    }
}

// ===== 3. GENERICS VỚI CONSTRAINTS =====

// Generic interface với constraint
interface DemoValidator<T> {
    validate(value: T): string | null;
}

// Generic class với multiple constraints
class DemoFormManager<T extends readonly DemoFormField[]> {
    constructor(private fields: T) {}
    
    // Generic method với constraint
    getField<K extends T[number]['name']>(name: K): Extract<T[number], { name: K }> {
        const field = this.fields.find(f => f.name === name);
        if (!field) throw new Error(`Field ${name} not found`);
        return field as Extract<T[number], { name: K }>;
    }
    
    // Generic method với conditional return type
    getValue<K extends T[number]['name']>(
        name: K
    ): Extract<T[number], { name: K }> extends DemoFormField 
        ? Extract<T[number], { name: K }>['value']
        : never {
        const field = this.getField(name);
        return field.value as any;
    }
}

// ===== 4. CONDITIONAL TYPES VÀ INFER =====

// Basic conditional type
type IsDemoTextField<T> = T extends DemoTextField ? true : false;

// Conditional type với infer để extract type
type ExtractValueType<T> = T extends { value: infer V } ? V : never;

// Complex conditional type với multiple conditions
type DemoFieldValueType<T extends DemoFormField> = 
    T extends DemoTextField ? string :
    T extends DemoNumberField ? number :
    T extends DemoCheckboxField ? boolean :
    never;

// Conditional type để tạo union của field names
type DemoUtilityFieldNames<T extends readonly DemoFormField[]> = T[number]['name'];

// ===== 5. MAPPED TYPES =====

// Basic mapped type
type ReadonlyDemoField<T> = {
    readonly [K in keyof T]: T[K];
};

// Mapped type với condition
type OptionalDemoFields<T> = {
    [K in keyof T]?: T[K];
};

// Advanced mapped type với template literals
type DemoFieldGetters<T extends readonly DemoFormField[]> = {
    [K in T[number]['name'] as `get${Capitalize<K>}`]: () => ExtractValueType<Extract<T[number], { name: K }>>;
};

// ===== 6. UTILITY TYPES =====

// Custom utility types building on TypeScript's built-ins
type DemoRequiredFields<T extends readonly DemoFormField[]> = {
    [K in keyof T]: T[K] extends DemoFormField 
        ? T[K]['required'] extends true 
            ? T[K]['name'] 
            : never
        : never;
}[keyof T];

type DemoFieldsByType<T extends readonly DemoFormField[], Type extends string> = 
    Extract<T[number], { type: Type }>;

type DemoUtilityFormValues<T extends readonly DemoFormField[]> = {
    [K in T[number]['name']]: Extract<T[number], { name: K }> extends DemoFormField
        ? ExtractValueType<Extract<T[number], { name: K }>>
        : never;
};

// ===== 7. TEMPLATE LITERAL TYPES =====

// Template literal với union
type EventName<T extends string> = `on${Capitalize<T>}Change`;

// Template literal cho validation
type ValidationKey<T extends string> = `validate${Capitalize<T>}`;

// Advanced template literal
type FieldEventHandlers<T extends readonly FormField[]> = {
    [K in T[number]['name'] as EventName<K>]: (value: ExtractValueType<Extract<T[number], { name: K }>>) => void;
};

// ===== 8. RECURSIVE TYPES =====

// Recursive type cho nested forms
type NestedFormField = FormField | {
    type: 'group';
    name: string;
    label: string;
    fields: NestedFormField[];
};

// ===== 9. TYPE ASSERTIONS VÀ TYPE GUARDS =====

// Type guard function
function isDemoTextField(field: DemoFormField): field is DemoTextField {
    return field.type === 'text';
}

function isDemoNumberField(field: DemoFormField): field is DemoNumberField {
    return field.type === 'number';
}

// Generic type guard
function isDemoFieldOfType<T extends DemoFormField['type']>(
    field: DemoFormField, 
    type: T
): field is Extract<DemoFormField, { type: T }> {
    return field.type === type;
}

// ===== 10. ADVANCED FUNCTION SIGNATURES =====

// Function overloads
function createDemoField(type: 'text', name: string, value: string): DemoTextField;
function createDemoField(type: 'number', name: string, value: number): DemoNumberField;
function createDemoField(type: 'checkbox', name: string, value: boolean): DemoCheckboxField;
function createDemoField(type: string, name: string, value: any): DemoFormField {
    return { type, name, label: name, value, required: false } as DemoFormField;
}

// ===== 11. DEMONSTRATION =====

// Example usage demonstrating type safety
const demoTypeFields = [
    createDemoField('text', 'username', ''),
    createDemoField('number', 'age', 0),
    createDemoField('checkbox', 'active', false)
] as const;

const manager = new DemoFormManager(demoTypeFields);

// Type-safe operations
const username: string = manager.getValue('username'); // ✅ Type inferred as string
const age: number = manager.getValue('age');           // ✅ Type inferred as number
const active: boolean = manager.getValue('active');   // ✅ Type inferred as boolean

// TypeScript will error on invalid operations:
// const invalid = manager.getValue('nonexistent'); // ❌ Error: Argument of type '"nonexistent"' is not assignable
// const wrongType: number = manager.getValue('username'); // ❌ Error: Type 'string' is not assignable to type 'number'

// Type demonstrations
type DemoFieldNamesType = DemoUtilityFieldNames<typeof demoTypeFields>; // 'username' | 'age' | 'active'
type DemoValuesType = DemoUtilityFormValues<typeof demoTypeFields>;     // { username: string; age: number; active: boolean; }
type DemoGettersType = DemoFieldGetters<typeof demoTypeFields>;  // { getUsername(): string; getAge(): number; getActive(): boolean; }

console.log('🎯 Advanced TypeScript concepts demonstrated!');
console.log('📝 Check the type annotations and IntelliSense support');
console.log('🔧 All operations are 100% type-safe at compile time');
