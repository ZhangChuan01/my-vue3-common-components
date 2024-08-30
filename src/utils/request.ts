/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios'
import { useGlobalStore } from '@/store'

interface RequestConfig extends InternalAxiosRequestConfig {
  loading?: boolean
}

const globalStore = useGlobalStore()

axios.interceptors.request.use((config: RequestConfig) => {
  const hasLoading = Object.hasOwn(config, 'loading')
  if (!hasLoading || (hasLoading && config.loading === false)) {
    globalStore.showSpin = true
  }
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const request = async <T = any>(config: AxiosRequestConfig): Promise<Api.Result<T>> => {
  try {
    const { data } = await axios.request<Api.Result<T>>(config)
    if (data.code !== 200) {
      // console.log(data.message)
      data.message && window.$message.error(data.message)
    }
    return data
  } catch (err: any) {
    globalStore.showSpin = false
    const { status, message } = err.response
    if (status === 401) {
      console.log('401')
    } else if (status === 403) {
      console.log('403')
    }
    return {
      code: -1,
      message,
      data: null as any
    }
  }
}

export default request