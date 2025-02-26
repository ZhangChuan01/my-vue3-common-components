export interface Title {
  label: string
  type: string
}
export interface Base {
  label?: string
  labelWidth?: string | number
  type?: string
  code?: string
  value?: string | number | boolean | { [key: string]: string | number | boolean } | null | string[] | any
  clearable?: boolean
  showPassword?: boolean
  placeholder?: string
  style?: { [key: string]: string | number }
  handleChange?: (val: string | number | boolean, oldVal?: string | number | boolean) => void
  disabled?: boolean
}
/**
 * @property {limitNumber} boolean 是否限制为数字
 * @property {limitIntNumber} boolean 是否限制为整数
 * @property {max} number 最大值
 * @property {min} number 最小值
 * @property {allowNegativeNumber} boolean 是否允许负数
 * @property {reg} RegExp 正则
 * @property {labelIsInner} boolean label是否内嵌
 */
export interface Input extends Base {
  limitNumber?: boolean
  limitIntNumber?: boolean
  max?: number
  min?: number
  labelIsInner?: boolean
  allowNegativeNumber?: boolean
  reg?: RegExp
}

/**
 * @property {options} Array 选项
 * @property {props} Object 选项的属性
 * @property {multiple} boolean 是否多选
 * @property {valueKey} string 设置此属性则绑定值为对象
 * @property {labelIsInner} boolean label是否内嵌
 * @property {emptyIsValue} boolean 空值是否是值
 * @property {customLabel} string 自定义label
 */
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