'use client'
import React, { useEffect, useState } from 'react'
import { fetchBlogDetail } from '@/lib/supabase/supabase'
import dayjs from 'dayjs'
interface BlogDetail {
  title: string
  author: string
  readTime: string
  tags: string[]
  content: string
  sympolDes: string
  created_at: string
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const [blogDetail, setBlogDetail] = useState<BlogDetail>({
    title: '',
    author: '',
    readTime: '',
    tags: [],
    content: '',
    sympolDes: '',
    created_at: ''
  })
  useEffect(() => {
    fetchBlogDetail(id).then(res => {
      console.log(res)
      setBlogDetail(res as BlogDetail)
    })
  }, [id])


  return (
    <div className='w-full h-[calc(100vh-80px)] overflow-hidden'>
      <div className='w-1/2 h-full bg-gradient-to-br from-blue-100 to-blue-200 max-w-4xl mx-auto font-bold p-8 overflow-y-auto'>
        <div className='text-2xl'>
          标题：{blogDetail.title}
        </div>
        <div className='font-[400]'> 
          作者：{blogDetail.author}
        </div>
        <div  className='font-[400]'>
          发布时间：{ dayjs(blogDetail.created_at).format('YYYY-MM-DD HH:mm:ss') }
        </div>
        <div className='w-full font-[400] bg-gray-300 p-4 mt-4 rounded-lg whitespace-pre-line'>
          { blogDetail.content }
        </div>
      </div>
    </div>
  )
}