import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!
);

interface Blog {
    title: string;
    content: string;
    tags: string[];
    sympolDes: string;
    author: string;
    readTime: number;
    user_id?: string;
}

// 发布博客接口 - 客户端版本
export const createBlogClient = async (blog: Omit<Blog, 'user_id'>) => {
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
        throw new Error('用户未登录或会话已过期');
    }
    
    // 创建博客时自动添加用户ID
    const blogWithUserId = {
        ...blog,
        user_id: user.id
    };
    
    const { data, error } = await supabase.from('blogList').insert(blogWithUserId)
    if (error) {
        console.log(error)
        throw error
    }
    return data
}

// 删除博客接口 - 客户端版本
export const deleteBlogClient = async (id: string) => {
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
        throw new Error('用户未登录或会话已过期');
    }
    
    // 先查询博客，验证用户权限
    const { data: blog, error: fetchError } = await supabase
        .from('blogList')
        .select('user_id')
        .eq('id', id)
        .single();
    
    if (fetchError) {
        throw new Error('博客不存在');
    }
    
    // 验证用户是否是博客作者
    if (blog.user_id !== user.id) {
        throw new Error('您没有权限删除此博客');
    }
    
    // 执行删除操作
    const { data, error } = await supabase.from('blogList').delete().eq('id', id)
    if (error) {
        console.log(error)
        throw error
    }
    return data
}

// 更新博客接口 - 客户端版本
export const updateBlogClient = async (id: string, blog: Omit<Blog, 'user_id'>) => {
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
        throw new Error('用户未登录或会话已过期');
    }
    
    // 先查询博客，验证用户权限
    const { data: existingBlog, error: fetchError } = await supabase
        .from('blogList')
        .select('user_id')
        .eq('id', id)
        .single();
    
    if (fetchError) {
        throw new Error('博客不存在');
    }
    
    // 验证用户是否是博客作者
    if (existingBlog.user_id !== user.id) {
        throw new Error('您没有权限修改此博客');
    }
    
    // 执行更新操作
    const { data, error } = await supabase.from('blogList').update(blog).eq('id', id)
    if (error) {
        console.log(error)
        throw error
    }
    return data
}

// 检查用户是否有权限编辑博客
export const checkBlogPermission = async (blogId: string) => {
    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
        return false;
    }
    
    // 查询博客的用户ID
    const { data: blog, error: fetchError } = await supabase
        .from('blogList')
        .select('user_id')
        .eq('id', blogId)
        .single();
    
    if (fetchError || !blog) {
        return false;
    }
    
    // 返回用户是否是博客作者
    return blog.user_id === user.id;
}
