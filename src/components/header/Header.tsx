import "./header.scss";
import {
    IconBell, IconMenu2, IconSettings, IconUserCircle, IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand,
    IconBrightnessUp, IconMoon
} from "@tabler/icons-react";

type HeaderProps = {
    collapsed?: boolean;
    onToggleCollapse?: () => void;
    onOpenMobileMenu?: () => void;
    onThemeToggle?: () => void;
    theme?: string;
};

export default function Header({collapsed, onToggleCollapse, onOpenMobileMenu, onThemeToggle, theme}: HeaderProps) {
    return (
        <>
            <div className={"header-container"}>
                <div className={"left-actions"}>
                    {/* Mobile hamburger: visible on small screens only */}
                    <button type="button" className="hamburger-btn md:hidden" aria-label="Open menu"
                            onClick={onOpenMobileMenu}>
                        <IconMenu2/>
                    </button>
                    <p className={`app-name ${collapsed ? 'hidden bg-red-500' : 'hidden lg:block'}`}>
                        Pet Shop App
                    </p>
                    <div className={"icons-container"}>
                        {/* Collapse toggle: visible on large screens only */}
                        <button
                            type="button"
                            className="reactive-btn sidebar-btn"
                            aria-label="Toggle sidebar"
                            onClick={onToggleCollapse}
                        >
                        <span
                        className={`icon-wrapper h-10 w-10 ${
                                collapsed ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                            }`}>
                            <IconLayoutSidebarLeftExpand/>
                        </span>
                        <span
                            className={`icon-wrapper h-10 w-10 ${
                                collapsed ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
                            }`}>
                            <IconLayoutSidebarLeftCollapse/>
                        </span>
                        </button>
                    </div>
                </div>

                <div className={"icons-container"}>
                    <button
                        type="button"
                        className="reactive-btn theme-btn"
                        aria-label="Toggle theme"
                        onClick={onThemeToggle}
                    >
                      <span
                          className={`icon-wrapper ${
                              theme === 'dark' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                          }`}
                      >
                        <IconBrightnessUp/>
                      </span>
                        <span
                            className={`icon-wrapper ${
                                theme === 'dark' ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
                            }`}
                        >
                        <IconMoon/>
                      </span>
                    </button>

                    <button type={"button"}>
                        <IconBell/>
                    </button>

                    <button type={"button"} className={"user-btn"}>
                        <IconUserCircle/>
                        <span>
                            Stefan
                        </span>
                    </button>

                    <button type={"button"}>
                        <IconSettings/>
                    </button>
                </div>
            </div>
        </>
    )
}
