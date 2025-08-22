import React from "react";
import type {FieldError, UseFormRegisterReturn} from "react-hook-form";

type TextInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> & {
    name: string
    label?: string
    registration: UseFormRegisterReturn
    error?: FieldError
};

export default function TextInput({ name, label, registration, error, placeholder, ...rest }: TextInputProps) {
    const displayLabel = label ?? name.charAt(0).toUpperCase() + name.slice(1)
    const displayPlaceholder = placeholder ?? `Enter ${displayLabel.toLowerCase()}`

    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={name} className="text-sm font-medium dark:text-white text-gray-700">
                {displayLabel}
            </label>
            <input
                id={name}
                type="text"
                placeholder={displayPlaceholder}
                className={`border rounded-lg p-2 focus:outline-none focus:ring-2 bg-white border border-gray-600 dark:bg-gray-300 dark:placeholder-white dark:gray-600 placeholder-gray-500 text-gray-800 ${
                    error ? "border-red-500 focus:ring-red-500" : "focus:ring-indigo-500"
                }`}
                {...registration}
                {...rest}
            />
            {error && <p className="text-sm text-red-600">{error.message}</p>}
        </div>
    )
}
