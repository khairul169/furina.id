import clsx, { ClassValue } from "clsx";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

export function cn(...classNames: ClassValue[]) {
  return twMerge(clsx(classNames));
}

export const copyToClipboard = (data: string) => {
  if (typeof navigator !== "undefined") {
    navigator.clipboard.writeText(data);
  }
};

export const showToast = (type: "success" | "error", message: string) => {
  toast(message, { type });
};
