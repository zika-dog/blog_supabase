import React, { useEffect, useRef, useState } from 'react';
import { Modal, message } from 'antd';
import { Form, Input, InputNumber, Select } from 'antd';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';
import type { SelectProps } from 'antd';
import { updateBlog } from '@/lib/supabase/supabase';
interface UpdateComProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    data: Blog;
}

interface Blog {
    title: string;
    content: string;
    tags: string[];
    sympolDes: string;
    author: string;
    readTime: number;
    id: string;
}
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

export default function UpdateCom(props: UpdateComProps) {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
    const draggleRef = useRef<HTMLDivElement>(null!);
    const [confirmLoading, setConfirmLoading] = useState(false);
    useEffect(() => {
        setOpen(props.open);
        if (props.open && props.data) {
            form.setFieldsValue({
                user: {
                    ...props.data
                }
            });
        }
    }, [props.open, props.data, form]);


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
        console.log(form.getFieldsValue(),props.data.id,'yuuuyy');
        
        setConfirmLoading(true);
        updateBlog(props.data.id, values.user).then(() => {
            message.success('修改成功');
            setConfirmLoading(false);
            setOpen(false);
            props.setOpen(false);
        }).catch(err => {
            console.log(err,'err');
            message.error('修改失败');
            setConfirmLoading(false);
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

    const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
        console.log(e);
        setOpen(false);
        props.setOpen(false);
    };

    const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
        const { clientWidth, clientHeight } = window.document.documentElement;
        const targetRect = draggleRef.current?.getBoundingClientRect();
        if (!targetRect) {
            return;
        }
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    };
    return (
        <Modal
            width={900}
            title={
                <div
                    style={{ width: '100%', cursor: 'move' }}
                    onMouseOver={() => {
                        if (disabled) {
                            setDisabled(false);
                        }
                    }}
                    onMouseOut={() => {
                        setDisabled(true);
                    }}
                    onFocus={() => { }}
                    onBlur={() => { }}
                >
                    博客修改
                </div>
            }
            open={open}
            onOk={() => form.submit()}
            okText="确定"
            cancelText="取消"
            onCancel={handleCancel}
            confirmLoading={confirmLoading}
            modalRender={(modal) => (
                <Draggable
                    disabled={disabled}
                    bounds={bounds}
                    nodeRef={draggleRef}
                    onStart={(event, uiData) => onStart(event, uiData)}
                >
                    <div ref={draggleRef}>{modal}</div>
                </Draggable>
            )}
        >
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
                            options={options}
                        />
                    </Form.Item>

                    <Form.Item name={['user', 'author']} label="作者" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['user', 'content']} label="文章内容" rules={[{ required: true }]}>
                        <Input.TextArea autoSize={{ minRows: 10 }} />
                    </Form.Item>

                </Form>
            </div>
        </Modal>
    )
}
