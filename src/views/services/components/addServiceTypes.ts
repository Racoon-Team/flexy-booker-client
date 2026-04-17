export type Step1Data = {
    name: string
    description?: string
    price?: number
}

export type NumericField = {
    type: 'numeric'
    label: string
}

export type SelectField = {
    type: 'select'
    label: string
    options: string[]
}

export type MultiSelectField = {
    type: 'multiselect'
    label: string
    options: string[]
}

export type CustomField = NumericField | SelectField | MultiSelectField
