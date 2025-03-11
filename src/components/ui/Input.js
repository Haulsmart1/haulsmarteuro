import React from 'react';
export default function Input({ value, onChange, placeholder }) {
    return (
        <input className="border px-3 py-2 rounded w-full" value={value} onChange={onChange} placeholder={placeholder} />
    );
}