"use client"
import React, { Component } from 'react'
import { Space, Table, Tag, Button, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { fetchData } from '@/lib/supabase/supabase';
import { deleteBlogClient } from '@/lib/supabase/client-apis'
import UpdateCom from '@/components/updateCom';
import Link from 'next/link';
interface DataType {
  key: string;
  title: string;
  author: string;
  created_at: string;
  tags: string[];
  id: string;
  content: string;
  sympolDes: string;
  readTime: number;
}

interface StateType {
  data: DataType[];
  loading: boolean;
  isOpen: boolean;
  confirmLoading: boolean;
  modalText: string;
  id: string;
  open: boolean;
  blogData: DataType | null;
}



export default class Page extends Component<Record<string, never>, StateType> {


  columns: ColumnsType<DataType> = [
    {
      title: '博客名称',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
      render: (_, { title, id }) => <Link href={`/blogs/detail/${id}`}>{title}</Link>,
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      align: 'center',
    },
    {
      title: '发布时间',
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      render: (_, { created_at }) => (
        <span>{this.formatTime(created_at)}</span>
      )
    },
    {
      title: '类型',
      key: 'tags',
      dataIndex: 'tags',
      align: 'center',
      render: (_, { tags }) => (
        <>
          {tags.map(tag => {
            const color = 'gold'
            return (
              <Tag color={color} key={tag}>
                {tag}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" className='bg-gray-600 hover:bg-gray-700 text-white' size='small' onClick={() => {
            this.setState({
              open: true,
              blogData: record
            })
          }}>编辑</Button>
          <Button type="primary" danger size='small' onClick={() => {
            this.setState({
              id: record.id,
              isOpen: true,
              confirmLoading: false,
              modalText: `是否确定删除 <${record.title}> 这篇文章！`
            })
          }}>删除</Button>
        </Space>
      ),
    },
  ];

  constructor(props: any) {
    super(props)
    this.state = {
      data: [],
      loading: true,
      isOpen: false,
      confirmLoading: false,
      modalText: '是否确定删除这篇文章！',
      id: '',
      open: false,
      blogData: null,
    }
  }

  // 时间格式化
  formatTime(isoString: string) {
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


  // 确认删除
  handleOk = () => {
    console.log('开始删除操作，ID:', this.state.id); // 添加调试日志
    this.setState({
      confirmLoading: true,
    }, () => {
      console.log('调用 deleteBlogClient...'); // 添加调试日志
      deleteBlogClient(this.state.id).then((res) => {
        console.log('删除成功，响应:', res); // 添加调试日志

        const _data = this.state.data.filter((item) => item.id != this.state.id)
        this.setState({
          data: _data
        })
      }).catch(err => {
        console.log('删除失败，错误:', err); // 添加调试日志

      }).finally(() => {
        console.log('删除操作完成'); // 添加调试日志
        this.setState({
          confirmLoading: false,
          isOpen: false
        })
      })
    })
  }
  // 取消删除
  handleCancel = () => {
    this.setState({
      isOpen: false
    })
  }

  // 编辑成功
  handleUpdate = (data: boolean) => {
    this.setState({
      open: data
    })
    this.componentDidMount();


  }


  componentDidMount() {
    fetchData().then((res) => {
      const _data = res.map((item: DataType, index: number) => ({
        ...item,
        key: item.id || `row-${index}`,
        id: item.id
      }))
      this.setState({
        data: _data
      })
    }).finally(() => {
      this.setState({
        loading: false
      })
    })
  }
  render() {
    return (
      <div className='h-full bg-gray-300 p-4'>
        <Modal
          title="提示"
          open={this.state.isOpen}
          okText="确定"
          cancelText="取消"
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        >
          <p>{this.state.modalText}</p>
        </Modal>
        {this.state.blogData && <UpdateCom data={this.state.blogData} open={this.state.open} setOpen={this.handleUpdate} />}
        <Table loading={this.state.loading} bordered size='small' pagination={false} columns={this.columns} dataSource={this.state.data} />
      </div>
    )
  }
}
