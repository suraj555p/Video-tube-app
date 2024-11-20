import React from 'react'

function Button({
    children,
    type = "button",
    bgColor = "bg-blue-500",
    textColor = "text-white",
    className = "",
    ...props
}) {
    return (
        <button className={`px-3 py-2 rounded-2xl ${bgColor} ${textColor} ${className}`} {...props} type={type}>
            {children}
        </button>
    )
}

export default Button
