import classNames from "classnames";
import type {ReactNode} from "react";

interface ButtonProps {
    children: ReactNode,
    type?: 'success' | 'info' | 'warning' | 'error' | 'default' | 'white' | 'transparent',
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
    onClick?: () => void,
    classes?: string,
    isSubmit?: boolean,
}

/**
 *
 * @param children
 * @param type
 * @param size
 * @param classes
 * @param isSubmit
 * @param onClick
 * @constructor
 */
export default function Button({
                                   children,
                                   type = 'default',
                                   size = "md",
                                   classes = '',
                                   isSubmit = false,
                                   onClick
                               }: ButtonProps) {

    const styling: string = classNames(
        "focus:outline-none font-medium rounded-lg focus:ring-4 hover:opacity-90",
        {
            "bg-green-700 focus:ring-green-300 dark:bg-green-600 dark:focus:ring-green-800": type === "success",
            "bg-red-700 focus:ring-red-300 dark:bg-red-600 dark:focus:ring-red-900": type === "error",
            "bg-yellow-400 focus:ring-yellow-300 dark:focus:ring-yellow-900": type === "warning",
            "bg-white border border-gray-700 focus:ring-gray-300 dark:focus:ring-gray-900 dark:text-gray-700 text-gray-700": type === "white",
            "bg-blue-700 focus:ring-blue-300 dark:bg-blue-600 dark:focus:ring-blue-800": type === "info" || type === "default",
            'transparent focus:ring-0': type === "transparent",
            "px-2 py-1 text-xs": size === "xs",
            "px-2.5 py-1.5 text-sm": size === "sm",
            "px-4 py-2 text-base": size === "md",
            "px-5 py-3 text-base": size === "lg",
            "px-6 py-3 text-lg": size === "xl",
            "px-6 py-4 text-lg": size === "2xl",
            "px-7 py-5 text-xl": size === "3xl",
        },
        classes);

    return (
        <>
            <button type={isSubmit ? "submit" : "button"}
                    onClick={onClick}
                    className={styling}>
                {children}
            </button>

        </>
    )
}
