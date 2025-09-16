export interface Badge {
  text?: string
  variant?: 'megatron' | 'tranquil' | 'oceanic' | 'maldives' | 'martini' | 'arctic' | 'cloudy' | 'sky' | 'margo' | 'limeade' | 'apple' | 'delicate' | 'blossom' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark' | string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  tag?: string
  color?: string
  backgroundColor?: string
  customClass?: string
}

export interface Tabs {
  tabs: Tab[]
  defaultTab?: number
  variant?: 'default' | 'pills' | 'underline'
  size?: 'sm' | 'md' | 'lg'
  centered?: boolean
}

export interface Tab {
  label: string
  component: Component
  content?: object | Array<object>
  disabled?: boolean
  badge?: string | number
  icon?: string
}