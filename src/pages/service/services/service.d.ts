export interface ResponseData<T = any> {
  code: number
  data?: T
  message: string
}

export interface VersionPlatform {
  versions: string[] | never[]
  platform_info: string[] | never[]
}

export interface AppInfo {
  app_name?: string
  service_id: number
  instance_id: number
  ipv_4_address: string
  port: number
}

export interface Field {
  value: string
  label: string
  selected?: boolean
}

export interface FieldDetail {
  topic_name: string
  input: {
    [key: string]: any
  }
  transformData?: any
  output: string
}

export interface PublishTableItem {
  id: string
  key: string
  type: string
  children?: PublishTableItem[]
  options?: any[]
  newOption?: any
  value: any
}

export interface StartParams {
  version: string
  appname: string
  ip_address: string
  mask: string
  platform: string
  data: { fields: any[]; methods: any[] }
}
