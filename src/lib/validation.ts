/**
 * Client-side validation utilities
 * Provides comprehensive form validation with user-friendly error messages
 */

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  fieldErrors: Record<string, string[]>
}

export interface ValidationRule {
  field: string
  rules: Array<{
    type: 'required' | 'email' | 'phone' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
    value?: any
    message: string
    validator?: (value: any) => boolean
  }>
}

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface ShippingAddress {
  address: string
  city: string
  postalCode: string
  country: string
}

export interface CheckoutFormData {
  customerInfo: CustomerInfo
  shippingAddress: ShippingAddress
  deliveryMethod: string
  newsletter: boolean
  terms: boolean
}

// ============================================================================
// VALIDATION PATTERNS
// ============================================================================

const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+48\s?)?(\d{3}\s?\d{3}\s?\d{3}|\d{9})$/,
  postalCode: {
    PL: /^\d{2}-\d{3}$/,
    DE: /^\d{5}$/,
    CZ: /^\d{3}\s?\d{2}$/,
    SK: /^\d{3}\s?\d{2}$/
  },
  name: /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-']{2,50}$/
} as const

// ============================================================================
// VALIDATION RULES
// ============================================================================

const CUSTOMER_INFO_RULES: ValidationRule[] = [
  {
    field: 'firstName',
    rules: [
      { type: 'required', message: 'Imię jest wymagane' },
      { type: 'minLength', value: 2, message: 'Imię musi mieć co najmniej 2 znaki' },
      { type: 'maxLength', value: 50, message: 'Imię nie może być dłuższe niż 50 znaków' },
      { type: 'pattern', value: VALIDATION_PATTERNS.name, message: 'Imię zawiera niedozwolone znaki' }
    ]
  },
  {
    field: 'lastName',
    rules: [
      { type: 'required', message: 'Nazwisko jest wymagane' },
      { type: 'minLength', value: 2, message: 'Nazwisko musi mieć co najmniej 2 znaki' },
      { type: 'maxLength', value: 50, message: 'Nazwisko nie może być dłuższe niż 50 znaków' },
      { type: 'pattern', value: VALIDATION_PATTERNS.name, message: 'Nazwisko zawiera niedozwolone znaki' }
    ]
  },
  {
    field: 'email',
    rules: [
      { type: 'required', message: 'Adres email jest wymagany' },
      { type: 'email', message: 'Wprowadź prawidłowy adres email' },
      { type: 'maxLength', value: 100, message: 'Adres email nie może być dłuższy niż 100 znaków' }
    ]
  },
  {
    field: 'phone',
    rules: [
      { type: 'required', message: 'Numer telefonu jest wymagany' },
      { type: 'phone', message: 'Wprowadź prawidłowy numer telefonu (np. +48 123 456 789)' }
    ]
  }
]

const SHIPPING_ADDRESS_RULES: ValidationRule[] = [
  {
    field: 'address',
    rules: [
      { type: 'required', message: 'Adres jest wymagany' },
      { type: 'minLength', value: 5, message: 'Adres musi mieć co najmniej 5 znaków' },
      { type: 'maxLength', value: 100, message: 'Adres nie może być dłuższy niż 100 znaków' }
    ]
  },
  {
    field: 'city',
    rules: [
      { type: 'required', message: 'Miasto jest wymagane' },
      { type: 'minLength', value: 2, message: 'Nazwa miasta musi mieć co najmniej 2 znaki' },
      { type: 'maxLength', value: 50, message: 'Nazwa miasta nie może być dłuższa niż 50 znaków' },
      { type: 'pattern', value: VALIDATION_PATTERNS.name, message: 'Nazwa miasta zawiera niedozwolone znaki' }
    ]
  },
  {
    field: 'postalCode',
    rules: [
      { type: 'required', message: 'Kod pocztowy jest wymagany' },
      { 
        type: 'custom', 
        message: 'Wprowadź prawidłowy kod pocztowy dla wybranego kraju',
        validator: (value: string, context?: any) => {
          const country = context?.country || 'PL'
          const pattern = VALIDATION_PATTERNS.postalCode[country as keyof typeof VALIDATION_PATTERNS.postalCode]
          return pattern ? pattern.test(value) : true
        }
      }
    ]
  },
  {
    field: 'country',
    rules: [
      { type: 'required', message: 'Kraj jest wymagany' },
      { 
        type: 'custom',
        message: 'Wybierz prawidłowy kraj',
        validator: (value: string) => ['PL', 'DE', 'CZ', 'SK', 'Polska', 'Niemcy', 'Czechy', 'Słowacja'].includes(value)
      }
    ]
  }
]

const CHECKOUT_FORM_RULES: ValidationRule[] = [
  {
    field: 'deliveryMethod',
    rules: [
      { type: 'required', message: 'Wybierz metodę dostawy' },
      { 
        type: 'custom',
        message: 'Wybierz prawidłową metodę dostawy',
        validator: (value: string) => ['standard', 'express'].includes(value)
      }
    ]
  },
  {
    field: 'terms',
    rules: [
      { 
        type: 'custom',
        message: 'Musisz zaakceptować regulamin',
        validator: (value: boolean) => value === true
      }
    ]
  }
]

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates a single field against its rules
 */
const validateField = (value: any, rules: ValidationRule['rules'], context?: any): string[] => {
  const errors: string[] = []

  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors.push(rule.message)
        }
        break

      case 'email':
        if (value && !VALIDATION_PATTERNS.email.test(value)) {
          errors.push(rule.message)
        }
        break

      case 'phone':
        if (value && !VALIDATION_PATTERNS.phone.test(value)) {
          errors.push(rule.message)
        }
        break

      case 'minLength':
        if (value && value.length < rule.value) {
          errors.push(rule.message)
        }
        break

      case 'maxLength':
        if (value && value.length > rule.value) {
          errors.push(rule.message)
        }
        break

      case 'pattern':
        if (value && !rule.value.test(value)) {
          errors.push(rule.message)
        }
        break

      case 'custom':
        if (rule.validator && !rule.validator(value, context)) {
          errors.push(rule.message)
        }
        break
    }
  }

  return errors
}

/**
 * Validates data against a set of validation rules
 */
const validateData = (data: any, validationRules: ValidationRule[], context?: any): ValidationResult => {
  const fieldErrors: Record<string, string[]> = {}
  const allErrors: string[] = []

  for (const rule of validationRules) {
    const fieldValue = data[rule.field]
    const errors = validateField(fieldValue, rule.rules, context)
    
    if (errors.length > 0) {
      fieldErrors[rule.field] = errors
      allErrors.push(...errors)
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    fieldErrors
  }
}

// ============================================================================
// PUBLIC VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates customer information
 */
export const validateCustomerInfo = (customerInfo: CustomerInfo): ValidationResult => {
  return validateData(customerInfo, CUSTOMER_INFO_RULES)
}

/**
 * Validates shipping address
 */
export const validateShippingAddress = (shippingAddress: ShippingAddress): ValidationResult => {
  return validateData(shippingAddress, SHIPPING_ADDRESS_RULES, { country: shippingAddress.country })
}

/**
 * Validates complete checkout form
 */
export const validateCheckoutForm = (formData: CheckoutFormData): ValidationResult => {
  // Validate customer info
  const customerValidation = validateCustomerInfo(formData.customerInfo)
  
  // Validate shipping address
  const shippingValidation = validateShippingAddress(formData.shippingAddress)
  
  // Validate checkout-specific fields
  const checkoutValidation = validateData(formData, CHECKOUT_FORM_RULES)

  // Combine all results
  const combinedFieldErrors = {
    ...customerValidation.fieldErrors,
    ...shippingValidation.fieldErrors,
    ...checkoutValidation.fieldErrors
  }

  const combinedErrors = [
    ...customerValidation.errors,
    ...shippingValidation.errors,
    ...checkoutValidation.errors
  ]

  return {
    isValid: combinedErrors.length === 0,
    errors: combinedErrors,
    fieldErrors: combinedFieldErrors
  }
}

/**
 * Validates a single field in real-time
 */
export const validateSingleField = (
  fieldName: string, 
  value: any, 
  formType: 'customer' | 'shipping' | 'checkout',
  context?: any
): string[] => {
  let rules: ValidationRule[] = []

  switch (formType) {
    case 'customer':
      rules = CUSTOMER_INFO_RULES
      break
    case 'shipping':
      rules = SHIPPING_ADDRESS_RULES
      break
    case 'checkout':
      rules = CHECKOUT_FORM_RULES
      break
  }

  const fieldRule = rules.find(rule => rule.field === fieldName)
  if (!fieldRule) return []

  return validateField(value, fieldRule.rules, context)
}

/**
 * Formats validation errors for display
 */
export const formatValidationErrors = (validation: ValidationResult): string => {
  if (validation.isValid) return ''

  if (validation.errors.length === 1) {
    return validation.errors[0]
  }

  return `Znaleziono ${validation.errors.length} błędów:\n• ${validation.errors.join('\n• ')}`
}

/**
 * Gets field-specific error message
 */
export const getFieldError = (validation: ValidationResult, fieldName: string): string => {
  const fieldErrors = validation.fieldErrors[fieldName]
  return fieldErrors && fieldErrors.length > 0 ? fieldErrors[0] : ''
}

/**
 * Checks if field has errors
 */
export const hasFieldError = (validation: ValidationResult, fieldName: string): boolean => {
  return validation.fieldErrors[fieldName] && validation.fieldErrors[fieldName].length > 0
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Sanitizes input value
 */
export const sanitizeInput = (value: string): string => {
  return value.trim().replace(/\s+/g, ' ')
}

/**
 * Formats phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 9) {
    return `+48 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('48')) {
    const number = cleaned.slice(2)
    return `+48 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`
  }
  
  return phone
}

/**
 * Formats postal code based on country
 */
export const formatPostalCode = (postalCode: string, country: string): string => {
  const cleaned = postalCode.replace(/\D/g, '')
  
  switch (country) {
    case 'PL':
    case 'Polska':
      if (cleaned.length === 5) {
        return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`
      }
      break
    case 'CZ':
    case 'Czechy':
    case 'SK':
    case 'Słowacja':
      if (cleaned.length === 5) {
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
      }
      break
  }
  
  return postalCode
}

/**
 * Gets country code from country name
 */
export const getCountryCode = (countryName: string): string => {
  const countryMap: Record<string, string> = {
    'Polska': 'PL',
    'Niemcy': 'DE',
    'Czechy': 'CZ',
    'Słowacja': 'SK'
  }
  
  return countryMap[countryName] || countryName
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const VALIDATION_CONSTANTS = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MAX_EMAIL_LENGTH: 100,
  MIN_ADDRESS_LENGTH: 5,
  MAX_ADDRESS_LENGTH: 100,
  MAX_CITY_LENGTH: 50,
  SUPPORTED_COUNTRIES: ['PL', 'DE', 'CZ', 'SK', 'Polska', 'Niemcy', 'Czechy', 'Słowacja'],
  DELIVERY_METHODS: ['standard', 'express']
} as const