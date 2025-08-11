import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
)

export default supabase;

interface Blog {
    title: string;
    content: string;
    tags: string[];
    sympolDes: string;
    author: string;
    readTime: number;
}

// 查询博客列表接口
export const fetchData = async () => {
    const { data, error } = await supabase.from('blogList').select()
    if (error) {
        console.log(error)
        throw error
    }
    return data
}

// 发布博客接口
export const createBlog = async (blog: Blog) => {
    const { data, error } = await supabase.from('blogList').insert(blog)
    if (error) {
        console.log(error)
        throw error
    }
    return data
}

// 通过id查询博客详情 eq('id', id)通过id查询单个数据    .single() 方法确保只返回一条记录 返回的数据就是{},不加.single() 返回的是[]
export const fetchBlogDetail = async (id: string) => {
    const { data, error } = await supabase.from('blogList').select().eq('id', id).single()
    if (error) {
        console.log(error)
        throw error
    }
    return data
}

// 删除博客接口
export const deleteBlog = async (id: string) => {
    const { data, error } = await supabase.from('blogList').delete().eq('id', id)
    if (error) {
        console.log(error)
        throw error
    }
    return data
}

// 更新博客接口
export const updateBlog = async (id: string, blog: Blog) => {
    const { data, error } = await supabase.from('blogList').update(blog).eq('id', id)
    if (error) {
        console.log(error)
        throw error
    }
    return data
}