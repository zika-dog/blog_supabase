"use client"
import React from 'react'
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
//hasEnvVars 代表supabase链接状态
import { hasEnvVars } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from 'next/navigation';

export default function header() {
    const pathname = usePathname()
    const navList = [
        { href: "/", label: "首页", active: pathname === "/" },
        { href: "/blogs/createBlog", label: "发布文章", active: pathname === "/blogs/createBlog" },
        { href: "/blogs/classification", label: "文章管理", active: pathname === "/blogs/classification" }
    ]

    return (
        <div className="w-full flex items-center h-[80px] border-b-[1px] px-[16px] justify-between">
            <div className="flex items-center gap-[16px]">
                <Image src="/images/blogIcon.jpeg" alt="logo" width={46} height={46} className="rounded-full" />
                <h1 className="text-[24px] font-bold">hold on ⛽️</h1>
            </div>
            <div className='flex items-center gap-[16px]'>

                {
                    navList.map((item) => {
                        return (
                            <Button
                                key={item.href}
                                asChild
                                size="sm"
                                variant={item.active ? "default" : "secondary"}
                                className={item.active ? "bg-gray-600 hover:bg-gray-700 text-white" : ""}
                            >
                                <Link href={item.href}>{item.label}</Link>
                            </Button>
                        )

                    })
                }

                {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
            </div>
        </div>
    )
}
