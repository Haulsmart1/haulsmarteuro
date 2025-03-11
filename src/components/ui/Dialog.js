import React from 'react';
export default function Dialog({ isOpen, onClose, children }) {
    return isOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-lg">
                {children}
                <button className="mt-4 text-red-500" onClick={onClose}>Close</button>
            </div>
        </div>
    ) : null;
}