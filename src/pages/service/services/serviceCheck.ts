import type { ResponseData, VersionPlatform, AppInfo, FieldDetail, StartParams } from './service'
import { post } from '../utils/axios';

// 获取支持的ZKOS版本信息
export async function getVersionPlatform(): Promise<ResponseData<VersionPlatform>> {
  return (await post('/verify/get_version_platform')) as unknown as ResponseData<VersionPlatform>
}

// 发送初始化信息接口 /verify/env_init
export async function envInit(data: {
  env_root_path: string
  arxml_file_path: string
}): Promise<ResponseData> {
  return post('/verify/env_init', data) as unknown as ResponseData
}

// 获取应用信息接口 /verify/get_appinfo
export async function getAppInfo(data: { appname: string }): Promise<ResponseData<AppInfo>> {
  return post('/verify/get_appinfo', data) as unknown as ResponseData<AppInfo>
}

// 获取publish列表接口 /verify/get_fields
export async function getFields(data: { appname: string }): Promise<ResponseData<string[]>> {
  return post('/verify/get_fields', data) as unknown as ResponseData<string[]>
}

// 获取publish详情接口 /verify/get_field_detail
export async function getFieldDetail(data: {
  appname: string
  field_name: string
}): Promise<ResponseData<FieldDetail>> {
  return post('/verify/get_field_detail', data) as unknown as ResponseData<FieldDetail>
}

// 启动构建接口 /verify/start
export async function start(data: StartParams): Promise<ResponseData> {
  return post('/verify/start', data) as unknown as ResponseData
}

// 按钮选择信息接口 /verify/commit
export async function commit(data: { type: number }): Promise<ResponseData> {
  return post('/verify/commit', data) as unknown as ResponseData
}
