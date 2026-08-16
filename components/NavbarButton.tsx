import Link from "next/link";
import React from "react";

interface NavbarButtonProps {
href: string
datatip: string
children: React.ReactNode
}

export default function NavbarButton({href, datatip,children}:NavbarButtonProps) {
    return (
        <Link href={href}>
            <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex gap-2" data-tip={datatip}>
                {children}
            </button>
        </Link>
    )
}