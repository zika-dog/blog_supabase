'use client'
import React ,{ useEffect, useState } from 'react'
import { Button, Form, Input, InputNumber, Select, message } from 'antd';
import { createBlog ,fetchTags} from '@/lib/supabase/supabase';
import type { SelectProps } from 'antd';
import { createBlogClient } from '@/lib/supabase/client-apis';
const options: SelectProps['options'] = [
  {
    label: 'react',
    value: 'react',
  },
  {
    label: 'nextjs',
    value: 'nextjs',
  },
  {
    label: 'go',
    value: 'go',
  },
  {
    label: 'web3',
    value: 'web3',
  },
  {
    label: 'solidity',
    value: 'solidity',
  },
  {
    label: 'rust',
    value: 'rust',
  },
  {
    label: 'python',
    value: 'python',
  },
  {
    label: 'java',
    value: 'java',
  },
  {
    label: 'cicd',
    value: 'cicd',
  },
];


const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
export default function Page() {
  const [form] = Form.useForm();
  const [tags, setTags] = useState<{label:string,value:string}[]>([])
  useEffect(() => {
    fetchTags().then((res) => {
      setTags(res)
    })
  }, [])
  const validateMessages = {
    required: '${label} 不能为空哦!',
    types: {
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };

  const onFinish = (values: { user: { title: string; content: string; tags: string[]; sympolDes: string; author: string; readTime: number } }) => {
    console.log(values);
    createBlogClient({ ...values.user }).then(() => {
      message.success('发布成功');
      // 发布成功后重置表单
      form.resetFields();
    }).catch(err => {
      console.log(err)
      message.error('发布失败');
    })
  };


  // 设置表单初始值
  const initialValues = {
    user: {
      title: '',
      sympolDes: '',
      readTime: undefined,
      tags: [],
      author: '',
      content: ''
    }
  };

  return (
    <div className='p-[16px] w-full h-full flex justify-center items-center'>
      <div className='w-[800px] p-[16px]'>
        <Form {...layout} form={form} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages} initialValues={initialValues}>
          <Form.Item name={['user', 'title']} label="标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={['user', 'sympolDes']} label="文章简介" rules={[{ required: false }]}>
            <Input />
          </Form.Item>
          <Form.Item name={['user', 'readTime']} label="阅读参考时间" rules={[{ type: 'number' }]}>
            <InputNumber />
          </Form.Item>

          <Form.Item
            name={['user', 'tags']}
            label="文章类型"
            rules={[{ required: true, message: '请选择文章类型!' }]}
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              options={tags}
            />
          </Form.Item>

          <Form.Item name={['user', 'author']} label="作者" rules={[{ required: false }]}>
            <Input />
          </Form.Item>
          <Form.Item name={['user', 'content']}  label="文章内容" rules={[{ required: true }]}>
            <Input.TextArea autoSize={{ minRows: 10}} />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              发布
            </Button>
          </Form.Item>
        </Form>
      </div>

    </div>
  )
}
