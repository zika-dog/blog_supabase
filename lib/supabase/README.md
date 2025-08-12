# Supabase 博客接口使用说明

## 概述
本模块提供了两套博客操作接口：
1. **基础接口** (`supabase.ts`) - 无权限验证，适用于服务器端或需要绕过权限的场景
2. **客户端安全接口** (`client-apis.ts`) - 带用户权限验证，确保只有文章作者才能操作自己的文章

## 客户端安全接口

### 1. 发布博客 (`createBlogClient`)
```typescript
import { createBlogClient } from './lib/supabase/client-apis';

const blog = {
    title: "我的博客标题",
    content: "博客内容...",
    tags: ["技术", "编程"],
    sympolDes: "简短描述",
    author: "作者名",
    readTime: 5
};

try {
    const result = await createBlogClient(blog);
    console.log('博客发布成功:', result);
} catch (error) {
    console.error('发布失败:', error.message);
}
```

**特性：**
- 自动获取当前登录用户ID
- 自动将用户ID绑定到博客记录
- 如果用户未登录会抛出错误

### 2. 删除博客 (`deleteBlogClient`)
```typescript
import { deleteBlogClient } from './lib/supabase/client-apis';

try {
    const result = await deleteBlogClient('blog-id-123');
    console.log('博客删除成功:', result);
} catch (error) {
    console.error('删除失败:', error.message);
}
```

**特性：**
- 验证当前用户是否是博客作者
- 只有作者才能删除自己的博客
- 如果权限不足会抛出相应错误

### 3. 更新博客 (`updateBlogClient`)
```typescript
import { updateBlogClient } from './lib/supabase/client-apis';

const updatedBlog = {
    title: "更新后的标题",
    content: "更新后的内容...",
    tags: ["技术", "编程", "新标签"],
    sympolDes: "更新后的描述",
    author: "作者名",
    readTime: 8
};

try {
    const result = await updateBlogClient('blog-id-123', updatedBlog);
    console.log('博客更新成功:', result);
} catch (error) {
    console.error('更新失败:', error.message);
}
```

**特性：**
- 验证当前用户是否是博客作者
- 只有作者才能修改自己的博客
- 如果权限不足会抛出相应错误

### 4. 检查博客权限 (`checkBlogPermission`)
```typescript
import { checkBlogPermission } from './lib/supabase/client-apis';

const hasPermission = await checkBlogPermission('blog-id-123');
if (hasPermission) {
    // 显示编辑/删除按钮
    console.log('用户有权限编辑此博客');
} else {
    // 隐藏编辑/删除按钮
    console.log('用户无权限编辑此博客');
}
```

**特性：**
- 检查当前用户是否有权限编辑指定博客
- 返回布尔值，便于UI条件渲染
- 不会抛出错误，适合在组件中使用

## 错误处理

所有客户端接口都会抛出带有中文错误信息的错误：

- `用户未登录或会话已过期` - 用户未登录或登录状态已过期
- `博客不存在` - 指定的博客ID不存在
- `您没有权限删除此博客` - 用户尝试删除非自己发布的博客
- `您没有权限修改此博客` - 用户尝试修改非自己发布的博客

## 数据库要求

确保你的 `blogList` 表包含 `user_id` 字段：

```sql
ALTER TABLE blogList ADD COLUMN user_id UUID REFERENCES auth.users(id);
```

## 使用建议

1. **在React组件中**：使用 `client-apis.ts` 中的接口
2. **在服务器端**：使用 `supabase.ts` 中的基础接口
3. **权限检查**：在显示编辑/删除按钮前先调用 `checkBlogPermission`
4. **错误处理**：使用 try-catch 包装所有接口调用，为用户提供友好的错误提示
