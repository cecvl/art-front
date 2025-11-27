import React, { useState, useRef, useEffect } from 'react';
import type { User } from '../../context/AuthContext';

interface UserMenuProps {
    user: User;
    onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleLogout = async () => {
        setIsOpen(false);
        await onLogout();
    };

    // Get user's first initial for avatar
    const getInitial = () => {
        if (user.displayName) {
            return user.displayName.charAt(0).toUpperCase();
        }
        if (user.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return 'U';
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* User Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="User menu"
                aria-expanded={isOpen}
            >
                {/* Avatar Circle */}
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-bold text-white">
                    {getInitial()}
                </div>

                {/* User Name */}
                <span className="hidden sm:inline max-w-[120px] truncate">
                    {user.displayName || user.email?.split('@')[0] || 'User'}
                </span>

                {/* Dropdown Arrow */}
                <svg
                    className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info Section */}
                    <div className="border-b border-gray-100 px-4 py-3">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {user.displayName || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {user.email}
                        </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                        {/* Profile Link (Future) */}
                        <button
                            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile
                            <span className="ml-auto text-xs text-gray-400">Soon</span>
                        </button>

                        {/* Settings Link (Future) */}
                        <button
                            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Settings
                            <span className="ml-auto text-xs text-gray-400">Soon</span>
                        </button>
                    </div>

                    {/* Logout Section */}
                    <div className="border-t border-gray-100 py-1">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
