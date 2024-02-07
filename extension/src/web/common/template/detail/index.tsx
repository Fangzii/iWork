import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { http } from '../../../../pages/utils/http';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Card, Form, Input, Dropdown, Label } from 'semantic-ui-react';
interface Props {
  onComplete: CallableFunction;
  title?: string;
}
export function TemplateDetail({ onComplete, title = '模版管理' }: Props) {
  const career = useSelector((state: any) => state.myInfo?.career);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const friendOptions = [
    {
      key: 'Jenny Hess',
      text: 'Jenny Hess',
      value: 'Jenny Hess',
      image: { avatar: true, src: '/images/avatar/small/jenny.jpg' },
    },
    {
      key: 'Elliot Fu',
      text: 'Elliot Fu',
      value: 'Elliot Fu',
      image: { avatar: true, src: '/images/avatar/small/elliot.jpg' },
    },
    {
      key: 'Stevie Feliciano',
      text: 'Stevie Feliciano',
      value: 'Stevie Feliciano',
      image: { avatar: true, src: '/images/avatar/small/stevie.jpg' },
    },
    {
      key: 'Christian',
      text: 'Christian',
      value: 'Christian',
      image: { avatar: true, src: '/images/avatar/small/christian.jpg' },
    },
    {
      key: 'Matt',
      text: 'Matt',
      value: 'Matt',
      image: { avatar: true, src: '/images/avatar/small/matt.jpg' },
    },
    {
      key: 'Justen Kitsune',
      text: 'Justen Kitsune',
      value: 'Justen Kitsune',
      image: { avatar: true, src: '/images/avatar/small/justen.jpg' },
    },
  ];

  const createTemplate = async () => {
    setLoading(true);
    await http.post('/api/create_template/', {
      name,
      content,
      description,
      is_public: isPublic,
      career_id: career?.id,
    });
    setLoading(false);
    toast.success(`创建${name}成功`);
    onComplete();
  };
  return (
    <Card style={{ width: '100%', height: '60vh' }}>
      <Card.Content header={title} style={{ maxHeight: '45px' }} />
      <Card.Content description>
        <Form>
          <Form.Field>
            <Label color="teal" style={{ marginBottom: '5px' }}>
              指令名称
            </Label>
            <Input
              placeholder="请输入指令名称"
              size="small"
              value={name}
              onChange={(evt) => setName(evt.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <Label color="blue" style={{ marginBottom: '5px' }}>
              指令简介
            </Label>
            <br></br>
            <Input
              placeholder="请输入指令内容, 显示在列表介绍"
              size="small"
              value={description}
              onChange={(evt) => setDescription(evt.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <Label style={{ marginBottom: '5px' }}>指令规则</Label>
            <TextareaAutosize
              placeholder="请输入指令规则，例如{{请输入参数1}}，{{请输入参数2}}，对比两者的区别"
              value={content}
              onChange={(evt) => setContent(evt.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <Label style={{ marginBottom: '5px' }}>职业</Label>
            <span style={{ color: '#bcbcbc', marginLeft: '10px' }}>
              {career?.name}
            </span>
          </Form.Field>
          {/* <Form.Field>
            <Label style={{ marginBottom: '5px' }}>模型选择</Label>
            <Dropdown
              clearable
              options={friendOptions}
              selection
              fluid
              size="small"
            />
          </Form.Field> */}
          <Form.Field inline>
            <Label
              as="a"
              color={isPublic ? 'green' : 'red'}
              onClick={() => setIsPublic(!isPublic)}
            >
              {isPublic ? '公开' : '不公开'}
            </Label>
            {!isPublic && (
              <Label pointing="left">
                如果公开并审核通过可获得xx 使用次数, 并根据指令使用次数获得
                xx使用次数
              </Label>
            )}
          </Form.Field>
          <Form.Field>
            {/* <Checkbox label="I agree to the Terms and Conditions" /> */}
          </Form.Field>
        </Form>
      </Card.Content>
      <Card.Content extra>
        <Button
          type="submit"
          style={{ float: 'right' }}
          onClick={() => createTemplate()}
          loading={loading}
          disabled={loading}
        >
          提交
        </Button>
      </Card.Content>
    </Card>
  );
}
