import { useState, useEffect } from 'react';
import { Form, Button, Col, Input, Popover, Progress, Row, Select, message, Upload } from 'antd';
import { Link, useRequest, history } from 'umi';
import styles from './style.less';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import * as apis from '@/services/ant-design-pro/api'
// import UploadAvatar from '@/components/UploadAvatar'


const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <span>强度：强</span>
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <span>强度：中</span>
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <span>强度：太短</span>
    </div>
  ),
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

const Register = () => {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [prefix, setPrefix] = useState('86');
  const [popover, setPopover] = useState(false);

  const [imageUrl, setImageUrl] = useState("")  //头像url
  const confirmDirty = false;
  let interval;
  const [form] = Form.useForm();
  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [interval],
  );

  const onGetCaptcha = () => {
    let counts = 59;
    setCount(counts);
    interval = window.setInterval(() => {
      counts -= 1;
      setCount(counts);

      if (counts === 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');

    if (value && value.length > 9) {
      return 'ok';
    }

    if (value && value.length > 5) {
      return 'pass';
    }

    return 'poor';
  };


  /**
   * @desc 处理图片上传
   * @param {*} content 上传的内容
   */
  // const uploadHandler = (content) => {
  //   let { file: { response } } = content
  // }


  /**
   * 提交注册信息
   * @param {*} values  form info
   */
  const onFinish = async (values) => {
    if (values?.avatar) {
      values.avatar = imageUrl
    }

    let res = await apis.register(values)
    if (res) {
      message.success('注册成功！');
      history.push({
        pathname: '/user/register-result',
        state: {
          account: values.email,
        },
      });
    } else {
      message.error('该账号已存在！');
    }

    // register(values);
  };

  const checkConfirm = (_, value) => {
    const promise = Promise;

    if (value && value !== form.getFieldValue('password')) {
      return promise.reject('两次输入的密码不匹配!');
    }

    return promise.resolve();
  };

  const checkPassword = (_, value) => {
    const promise = Promise; // 没有值的情况

    if (!value) {
      setVisible(!!value);
      return promise.reject('请输入密码!');
    } // 有值的情况

    if (!visible) {
      setVisible(!!value);
    }

    setPopover(!popover);

    if (value.length < 6) {
      return promise.reject('');
    }

    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }

    return promise.resolve();
  };

  const changePrefix = (value) => {
    setPrefix(value);
  };

  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };


  /**
   * @desc  normFile
   * @param {*} e  event
   * @returns 
   */
  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }

    let { file: { response, status } } = e
    if (status === "done") {
      if (response?.businessCode * 1 === 1000) {
        setImageUrl(response.content)
      }
      console.log(response)
    }
    return e && e.fileList;
  };


  return (
    <div className={styles.main}>
      <h3>注册</h3>
      <Form form={form} name="UserRegister" onFinish={onFinish}>
        {/* 用户名 */}
        <Row gutter={8}>
          <Col span={5}><FormItem label={"用户名"}></FormItem></Col>
          <Col span={19}><FormItem
            name="username"
            rules={[
              {
                required: true,
                message: '请输入用户名',
              },
              // {
              //   type: 'username',
              //   message: '用户名已存在!',
              // },
            ]}
          >
            <Input size="large" placeholder="用户名" />
          </FormItem></Col>
        </Row>
        {/* 密码 */}
        <Row gutter={8}>
          <Col span={5}><FormItem label={"密码"}></FormItem></Col>
          <Col span={19}><Popover
            getPopupContainer={(node) => {
              if (node && node.parentNode) {
                return node.parentNode;
              }

              return node;
            }}
            content={
              visible && (
                <div
                  style={{
                    padding: '4px 0',
                  }}
                >
                  {passwordStatusMap[getPasswordStatus()]}
                  {renderPasswordProgress()}
                  <div
                    style={{
                      marginTop: 10,
                    }}
                  >
                    <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
                  </div>
                </div>
              )
            }
            overlayStyle={{
              width: 240,
            }}
            placement="right"
            visible={visible}
          >
            <FormItem
              name="password"
              className={
                form.getFieldValue('password') &&
                form.getFieldValue('password').length > 0 &&
                styles.password
              }
              rules={[
                {
                  validator: checkPassword,
                },
              ]}
            >
              <Input size="large" type="password" placeholder="至少6位密码，区分大小写" />
            </FormItem>
          </Popover></Col>
        </Row>

        {/* 确认密码 */}
        <Row gutter={8}>
          <Col span={5}><FormItem label={"确认密码"}></FormItem></Col>
          <Col span={19}><FormItem
            name="confirm"
            rules={[
              {
                required: true,
                message: '确认密码',
              },
              {
                validator: checkConfirm,
              },
            ]}
          >
            <Input size="large" type="password" placeholder="确认密码" />
          </FormItem></Col>
        </Row>
        {/* 邮箱 */}
        <Row gutter={8}>
          <Col span={5}><FormItem label={"邮箱"}></FormItem></Col>
          <Col span={19}><FormItem
            name="email"
            rules={[
              {
                required: true,
                message: '请输入邮箱地址!',
              },
              {
                type: 'email',
                message: '邮箱地址格式错误!',
              },
            ]}
          >
            <Input size="large" placeholder="邮箱" />
          </FormItem>
          </Col>
        </Row>
        {/* 头像 */}
        <Row gutter={8}>
          <Col span={5}><FormItem label={"头像"}></FormItem></Col>
          <Col span={19}>
            <Form.Item
              name="avatar"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                onRemove={() => {
                  setImageUrl("")
                }}
                showUploadList={{
                  showPreviewIcon: false,
                  showDownloadIcon: false
                }}
                name="file"
                action="/api/upload/avatar"
                listType="picture-card">
                {imageUrl ? "" : <PlusOutlined />}
              </Upload>
            </Form.Item>

            {/* <FormItem
              name="avatar"

            >
              <Upload
                accept="image/*"
                showUploadList={false}
                action="/api/upload/avatar"
                onChange={(files) => {
                  let file = files.file
                  if (file?.status == "done" && file?.response?.businessCode == 1000) {
                    uploadHandler(file.response.content)
                  }
                }}
              >
                <button type="button" className="control-item button upload-button" data-title="插入图片">
                  <PlusOutlined />
                </button>
              </Upload>
            </FormItem> */}
          </Col>
        </Row>

        <InputGroup compact>
          <Select
            size="large"
            value={prefix}
            onChange={changePrefix}
            style={{
              width: '20%',
            }}
          >
            <Option value="86">+86</Option>
            <Option value="87">+87</Option>
          </Select>
          <FormItem
            style={{
              width: '80%',
            }}
            name="phone"
            rules={[
              {
                required: true,
                message: '请输入手机号!',
              },
              {
                pattern: /^\d{11}$/,
                message: '手机号格式错误!',
              },
            ]}
          >
            <Input size="large" placeholder="手机号" />
          </FormItem>
        </InputGroup>

        {/* 获取验证码第一版不做 */}
        {/* <Row gutter={8}>
          <Col span={16}>
            <FormItem
              name="captcha"
              rules={[
                {
                  required: true,
                  message: '请输入验证码!',
                },
              ]}
            >
              <Input size="large" placeholder="验证码" />
            </FormItem>
          </Col>
          <Col span={8}>
            <Button
              size="large"
              disabled={!!count}
              className={styles.getCaptcha}
              onClick={onGetCaptcha}
            >
              {count ? `${count} s` : '获取验证码'}
            </Button>
          </Col>
        </Row> */}
        <FormItem>
          <Button
            size="large"
            // loading={submitting}
            className={styles.submit}
            type="primary"
            htmlType="submit"
          >
            <span>注册</span>
          </Button>
          <Link className={styles.login} to="/user/login">
            <span>使用已有账户登录</span>
          </Link>
        </FormItem>
      </Form>
    </div >
  );
};

export default Register;
