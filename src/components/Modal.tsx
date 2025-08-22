import React, {useEffect, useRef, useState} from 'react';
import {IconX} from "@tabler/icons-react";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    closeOnEsc?: boolean;
    closeOnClickAway?: boolean;
};

const ANIMATION_MS = 300;

export default function Modal({
                                  isOpen,
                                  onClose,
                                  title,
                                  children,
                                  closeOnEsc = true,
                                  closeOnClickAway = true
                              }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeTimerRef = useRef<number | null>(null);

    // mounted controls whether the modal is rendered; isClosing toggles exit animation classes
    const [mounted, setMounted] = useState<boolean>(isOpen);
    const [isClosing, setIsClosing] = useState<boolean>(false);

    // Handle open/close transitions triggered by parent prop changes
    useEffect(() => {
        if (isOpen) {
            if (closeTimerRef.current) {
                window.clearTimeout(closeTimerRef.current);
                closeTimerRef.current = null;
            }
            setMounted(true);
            setIsClosing(false);
        } else if (mounted) {
            // Start closing animation, then unmount
            setIsClosing(true);
            if (closeTimerRef.current) {
                window.clearTimeout(closeTimerRef.current);
            }
            closeTimerRef.current = window.setTimeout(() => {
                setMounted(false);
                setIsClosing(false);
                closeTimerRef.current = null;
            }, ANIMATION_MS);
        }

        return () => {
            if (closeTimerRef.current) {
                window.clearTimeout(closeTimerRef.current);
                closeTimerRef.current = null;
            }
        };
    }, [isOpen, mounted]);

    useEffect(() => {
        if (!closeOnEsc) return;
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (mounted) {
            document.addEventListener('keydown', handleEsc);
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [closeOnEsc, mounted, onClose]);

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!closeOnClickAway) return;
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!mounted) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-700 transition-opacity duration-300 ${isClosing ? 'bg-opacity-0 opacity-0' : 'bg-opacity-50 opacity-100'}`}
            onClick={handleOutsideClick}
        >
            <div
                ref={modalRef}
                className={`bg-gray-100 dark:bg-gray-700 rounded-lg p-6 w-full max-w-md relative transform transition-all duration-300 ${isClosing ? 'opacity-0 translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}
            >
                {title && <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-700 dark:text-white">{title}</h2>}
                <button
                    className="absolute top-4 right-4  text-gray-700 dark:text-white hover:text-black dark:hover:text-gray-300 transform transition duration-200 hover:scale-105"
                    onClick={onClose}
                >
                    <IconX className="size-6"/>
                </button>
                {children}
            </div>
        </div>
    );
}
