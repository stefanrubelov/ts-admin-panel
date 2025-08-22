import "./side-menu.scss";
import {MenuItem} from "./MenuItem.tsx";
import {useEffect, useRef, useState, type CSSProperties} from "react";
import {useLocation} from "react-router";
import {IconHome, IconPaw, IconUsers} from "@tabler/icons-react";
import classNames from "classnames";

type SideMenuProps = {
    collapsed?: boolean; // large screens collapse state
    mobileOpen?: boolean; // small screens drawer open state
    onCloseMobile?: () => void;
};

export default function SideMenu({collapsed, mobileOpen, onCloseMobile}: SideMenuProps) {
    const location = useLocation();
    const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>({top: 0, height: 0});
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateIndicator = () => {
            const activeEl = containerRef.current?.querySelector<HTMLElement>(
                `.menu-item.active`
            );
            if (activeEl && containerRef.current) {
                const rect = activeEl.getBoundingClientRect();
                const parentRect = containerRef.current.getBoundingClientRect();
                setIndicatorStyle({
                    top: rect.top - parentRect.top,
                    height: rect.height,
                });
            }
        };

        // Small delay to ensure CSS transitions complete
        const timeoutId = setTimeout(updateIndicator, 200); // Slightly longer than your 300ms transition

        return () => clearTimeout(timeoutId);
    }, [location, collapsed]);

    // Main sidebar classes for md+ (static). For sm, we render a drawer overlay with position fixed.
    const sidebarClasses = classNames("side-menu", {
        collapsed: !!collapsed,
    });

    return (
        <>
            {/* Mobile overlay/backdrop */}
            {mobileOpen && (
                <div className="fixed inset-0 top-16 z-40 bg-slate-200 dark:bg-gray-700 md:hidden w-60" onClick={onCloseMobile}/>
            )}

            {/* Mobile drawer */}
            <div
                className={classNames(
                    sidebarClasses,
                    // Base visuals
                    "pb-4 px-0 !h-16",
                    // Positioning depending on screen size
                    "md:relative md:translate-x-0 md:h-[calc(100vh-60px)]",
                    // Width rules
                    "md:w-16",
                    // When collapsed on lg (must be mutually exclusive with lg:w-60 to avoid Tailwind precedence issues)
                    collapsed ? "lg:w-16" : "lg:w-60",
                    // Ensure flex layout (side-menu.scss already applies flex column)
                    // Mobile drawer behavior
                    "fixed top-0 left-0 h-screen w-56 transition-transform duration-300 ease-in-out",
                    mobileOpen ? "translate-x-0 z-50" : "-translate-x-full z-50 md:translate-x-0"
                )}
                ref={containerRef}
                onClick={(e) => {
                    const target = e.target as HTMLElement;
                    const link = target.closest('a.menu-item');
                    if (link && onCloseMobile) {
                        onCloseMobile();
                    }
                }}
            >
                <span
                    className="indicator absolute left-0 w-full  bg-slate-600 dark:bg-gray-400 rounded-xl transition-all duration-300 ease-in-out z-0"
                    style={indicatorStyle}
                />
                <MenuItem route={"/"}>
                    <IconHome/>
                    <span className="item-label inline md:hidden lg:inline">
                        Home
                    </span>
                </MenuItem>

                <MenuItem route={"/users"}>
                    <IconUsers/>
                    <span className="item-label inline md:hidden lg:inline">
                        Users
                    </span>
                </MenuItem>

                <MenuItem route={"/pets"}>
                    <IconPaw/>
                    <span className="item-label inline md:hidden lg:inline">
                        Pets
                    </span>
                </MenuItem>
            </div>
        </>
    )
}
