import {Link, useLocation} from "react-router";
import classNames from "classnames";
import type {ReactNode} from "react";

type MenuItemProps = {
    route: string;
    children: ReactNode;
};

export function MenuItem({route, children}: MenuItemProps) {
    const location = useLocation();
    const isActive =
        location.pathname === route ||
        location.pathname.startsWith(route + "/");
    const classes = classNames('menu-item', {
        active: isActive,
    })
    return (
        <Link
            to={route}
            className={classes}
        >
            {children}
        </Link>
    );
}
