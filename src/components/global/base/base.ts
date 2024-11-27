export interface Title {
  label: string
  type: string
}
export interface Base {
  label?: string
  labelWidth?: string | number
  code?: string
  value?: string | number | boolean | { [key: string]: string | number | boolean } | null | string[]
  type?: string
  clearable?: boolean
  showPassword?: boolean
  placeholder?: string
  style?: { [key: string]: string | number }
  handleChange?: (val: string | number | boolean, oldVal?: string | number | boolean) => void
  disabled?: boolean
}
export interface Input extends Base {
  limitNumber?: boolean
  limitIntNumber?: boolean
  max?: number
  min?: number
  labelIsInner?: boolean
  allowNegativeNumber?: boolean
}
export interface Select extends Base {
  options: { [key: string]: unknown }[]
  props?: { [key: string]: string }
  multiple?: boolean
  valueKey?: string
  codesMap?: { [key: string]: string }
  labelIsInner?: boolean
  emptyIsValue?: boolean
  customLabel?: string
}
export interface Date extends Base {
  valueFormat?: string
}
export interface Switch extends Base {
}
export interface ColorPicker extends Base {
}
export interface Cascader extends Base {
}