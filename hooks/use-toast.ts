'use client';

import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast"
import {
  useToast as useToastOriginal,
  toast as toastOriginal,
} from "@/components/ui/use-toast"

export type ToasterToast = ToastProps & {
  id: string
  title?: string
  description?: string
  action?: ToastActionElement
}

export const useToast = useToastOriginal
export const toast = toastOriginal