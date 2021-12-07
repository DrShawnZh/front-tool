import React from "react";
import { Form, Input, Button } from "antd";
import styles from "../index.less";

const GitSetting: React.FC = () => {
  const [form] = Form.useForm();

  const formWrapper = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  return (
    <Form form={form} {...formWrapper}>
      <Form.Item label="email" name="gitEmail">
        <Input />
      </Form.Item>
      <Form.Item label="username" name="gitUserName">
        <Input />
      </Form.Item>
      <Form.Item className={styles.submitBtn} label=" ">
        <Button type="primary">确定</Button>
      </Form.Item>
    </Form>
  );
};

export default GitSetting;
