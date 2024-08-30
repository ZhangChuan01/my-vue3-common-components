declare namespace ComponentsProps {
  interface Title {
    label: string
    type: string
  }
  interface Base {
    label?: string
    labelWidth?: string | number
    code: string
    value: string | number | boolean | { [key: string]: string | number | boolean} | null | string []
    type: string
    clearable?: boolean
    showPassword?: boolean
    placeholder?: string
    style?: { [key: string]: string | number }
    handleChange?: (val: string | number | boolean,oldVal?: string | number | boolean) => void
    disabled?: boolean
  }
  interface Input extends Base {
    limitNumber?: boolean
    limitIntNumber?: boolean
    max?: number
    min?: number
    labelIsInner?: boolean
  }
  interface Select extends Base {
    options: { [key: string]: unknown }[]
    props?: { [key: string]: string }
    multiple?: boolean
    valueKey?: string
    codesMap?: { [key: string]: string }
    labelIsInner?: boolean
    emptyIsValue?: boolean
    customLabel?: string
  }
  interface Date extends Base {
    valueFormat?: string
  }
  interface Switch extends Base {
  }
  interface ColorPicker extends Base {
  }
}