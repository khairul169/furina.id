import {twMerge} from 'tailwind-merge'
import clsx from 'clsx'

export const cn = (...args: any[]) => twMerge(clsx(...args))
