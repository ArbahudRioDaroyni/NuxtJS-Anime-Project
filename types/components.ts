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