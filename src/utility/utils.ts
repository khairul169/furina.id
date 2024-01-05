import clsx from "clsx";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cn = (...classNames: any[]) => {
  return twMerge(clsx(...classNames));
};

export const copyToClipboard = (data: string) => {
  if (typeof navigator !== "undefined") {
    navigator.clipboard.writeText(data);
  }
};

export const showToast = (type: "success" | "error", message: string) => {
  toast(message, { type });
};
