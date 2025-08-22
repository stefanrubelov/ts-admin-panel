import React, {useEffect, useState} from "react"
import type { FieldError, UseFormRegisterReturn } from "react-hook-form"

type DropdownProps = {
    name: string
    label?: string
    options: Record<string, string>
    registration: UseFormRegisterReturn
    error?: FieldError
    placeholder?: string
    defaultValue?: string
}

export default function Dropdown({ name, label, options, registration, error, placeholder, defaultValue }: DropdownProps) {
    const displayLabel = label ?? name.charAt(0).toUpperCase() + name.slice(1)
    const displayPlaceholder = placeholder ?? `Select ${displayLabel.toLowerCase()}`
    const [search, setSearch] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState<string>("")

    useEffect(() => {
        if (defaultValue && options[defaultValue]) {
            setSelected(options[defaultValue])
            registration.onChange({ target: { name, value: defaultValue } })
        }
    }, [defaultValue])

    const filteredOptions = Object.entries(options).filter(([_, value]) =>
        value.toLowerCase().includes(search.toLowerCase())
    )

    const handleSelect = (key: string, value: string) => {
        setSelected(value)
        setIsOpen(false)
        setSearch("")
        registration.onChange({ target: { name, value: key } })
    }

    return (
        <div className="flex flex-col gap-1 relative">
            <label htmlFor={name} className="text-sm font-medium dark:text-white text-gray-700">
                {displayLabel}
            </label>
            <div
                className={`border rounded-lg p-2 bg-white dark:bg-gray-300 text-gray-800 placeholder-gray-500 dark:placeholder-white cursor-pointer ${
                    error ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-indigo-500"
                }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selected || <span className="text-gray-500">{displayPlaceholder}</span>}
            </div>

            <input type="hidden" {...registration} value={Object.keys(options).find(key => options[key] === selected) || ""} />

            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-gray-300 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="w-full p-2 border-b border-gray-300 focus:outline-none placeholder-gray-500 dark:placeholder-white bg-white dark:bg-gray-300 text-gray-800"
                    />
                    <ul className="max-h-48 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(([key, value]) => (
                                <li
                                    key={key}
                                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-400 cursor-pointer dark:text-white text-gray-700"
                                    onClick={() => handleSelect(key, value)}
                                >
                                    {value}
                                </li>
                            ))
                        ) : (
                            <li className="p-2 text-gray-500">No results</li>
                        )}
                    </ul>
                </div>
            )}

            {error && <p className="text-sm text-red-600">{error.message}</p>}
        </div>
    )
}
