import "./side-menu.scss";
import {MenuItem} from "./MenuItem.tsx";
import {useEffect, useRef, useState, type CSSProperties} from "react";
import {useLocation} from "react-router";
import {IconHome, IconPaw, IconUsers} from "@tabler/icons-react";
import classNames from "classnames";

type SideMenuProps = {
    collapsed?: boolean;
    mobileOpen?: boolean;
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

        const timeoutId = setTimeout(updateIndicator, 200);

        return () => clearTimeout(timeoutId);
    }, [location, collapsed]);


    return (
        <>
            {/* Mobile overlay/backdrop */}
            {mobileOpen && (
                <div className="fixed inset-0 top-16 z-40 bg-slate-200 dark:bg-gray-700 md:hidden w-60"
                     onClick={onCloseMobile}/>
            )}

            {/* Mobile drawer */}
            <div
                className={classNames(
                    "side-menu pb-4 px-0 md:w-16 md:relative md:translate-x-0 fixed top-0 left-0 h-screen w-56 transition-transform duration-300 ease-in-out md:h-[calc(100vh-60px)] ",
                    {
                        collapsed: !!collapsed,
                        "lg:w-16": collapsed,
                        "lg:w-60": !collapsed,
                        "translate-x-0 z-50": mobileOpen,
                        "-translate-x-full z-50 md:translate-x-0": !mobileOpen
                    }
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
                    className="indicator"
                    style={indicatorStyle}
                />
                <MenuItem route={"/"}>
                    <IconHome/>
                    <span className="item-label">
                        Home
                    </span>
                </MenuItem>

                <MenuItem route={"/users"}>
                    <IconUsers/>
                    <span className="item-label">
                        Users
                    </span>
                </MenuItem>

                <MenuItem route={"/pets"}>
                    <IconPaw/>
                    <span className="item-label">
                        Pets
                    </span>
                </MenuItem>
            </div>
        </>
    )
}
