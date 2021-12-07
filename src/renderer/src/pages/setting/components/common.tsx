import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import styles from "../index.less";
import { useSelector } from "react-redux";
import { getSettings } from "../../../store/global";
import { useDispatch } from "react-redux";

const CommonSetting: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // @ts-ignore
  const settings = useSelector((state) => state.global.settings);

  useEffect(() => {
    if (settings) {
      console.log(settings);
      form.setFieldsValue({ projectDir: settings.projectDir });
    }
  }, [settings]);

  const formWrapper = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  const chooseDir = () => {
    // @ts-ignore
    const res = window.ipcRenderer.sendSync("choose-dir");
    console.log(res);
    const index = res.filePath.lastIndexOf("/");
    form.setFieldsValue({ projectDir: res.filePath.slice(0, index) });
  };

  const submit = () => {
    form.validateFields().then(async (values) => {
      console.log(values);

      // @ts-ignore
      const res = window.ipcRenderer.sendSync("save-settings", values);
      message.success("设置成功");
      await dispatch(getSettings());
    });
  };

  return (
    <Form form={form} {...formWrapper}>
      <Form.Item label="默认保存目录" name="projectDir">
        <Input onClick={chooseDir} />
      </Form.Item>
      <Form.Item className={styles.submitBtn} label=" ">
        <Button type="primary" onClick={submit}>
          确定
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CommonSetting;
