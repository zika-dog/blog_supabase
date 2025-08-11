"use client"
import React, { useEffect, useState } from 'react'
import { fetchData } from '@/lib/supabase/supabase'
import {
    Card,
} from "@/components/ui/card";
import { Tag } from 'antd';
import Link from 'next/link';
interface ListData {
    id: number;
    title: string;
    tags: [];
    content: string;
    sympolDes: string;
    author: string;
    readTime: number;
    created_at: string;
}
export default function content() {
    const [listData, setListData] = useState<ListData[]>([])
    useEffect(() => {
        fetchData().then(res => {
            console.log(res)
            setListData(res as ListData[])
        })
    }, [])
    // 时间格式化
    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(date).replace(/\//g, '-');
    }
    return (
        <div className="h-[calc(100vh-80px)] bg-gray-300 overflow-y-auto">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 font-bold">

                {listData.map((item) => (
                    <Link href={`/blogs/detail/${item.id}`} key={item.id}>
                        <div className=" hover:scale-105 transition-all duration-300 cursor-pointer">
                            <Card className="h-full">
                                <div className="flex flex-col gap-[10px] h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-[16px]">
                                    <p className='text-2xl font-bold'>{item.title}</p>
                                    <p>作者：{item.author}</p>
                                    <p>
                                        文章简介：{item.sympolDes}
                                    </p>
                                    <p>
                                        建议阅读时间：{item.readTime}分钟
                                    </p>
                                    <p>
                                        发布时间：{ formatTime( item.created_at)}
                                    </p>
                                    <div className='flex'>
                                        {
                                            item.tags.map((item) => (
                                                <p key={item}>
                                                    <Tag color="gold" >{item}</Tag>
                                                </p>
                                            ))
                                        }
                                    </div>


                                </div>
                            </Card>
                        </div>
                    </Link>

                ))}

            </div>
        </div>
    )
}



