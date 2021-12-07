import React, { useEffect, useState } from "react";
import { Form, Input, message, Modal, Radio, Button } from "antd";
import styles from "../index.less";
import { useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";

interface AddProjectProps {
  visible: boolean;
  setVisible(v: boolean): void;
  refresh(): void;
}

interface MsgStatus {
  install?: number;
  run?: number;
  added?: number;
  finished?: boolean;
}

const AddProject: React.FC<AddProjectProps> = ({
  visible,
  setVisible,
  refresh,
}) => {
  // @ts-ignore
  const settings = useSelector((state) => state.global.settings);

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const [status, setStatus] = useState<MsgStatus>({
    added: 0,
    run: 0,
    install: 0,
  });
  const [statusTxt, setStatusTxt] = useState<string>("");

  useEffect(() => {
    if (visible) {
      initMessage();
    }

    return () => {
      // @ts-ignore
      window.ipcRenderer.removeListener("install-and-run-reply", () => {});
    };
  }, [visible]);

  useEffect(() => {
    if (settings) {
      form.setFieldsValue({ projectPath: settings.projectDir });
    }
  }, [settings]);

  const [form] = Form.useForm();

  const initMessage = () => {
    // 接收安装和运行消息
    // @ts-ignore
    window.ipcRenderer.on(
      "install-and-run-reply",
      (event, status: MsgStatus) => {
        
        msgAfter(status);
      }
    );
  };

  const msgAfter = (status: MsgStatus) => {
    setStatus(status);
    if (!visible) return;
    if (status.finished) {
      console.log("数据添加完成");
      cancel();
      refresh();
      message.success("添加成功");
    }
    if (status.install === 1) {
      setStatusTxt("正在install");
    } else if (status.install === 2) {
      setStatusTxt("install完毕");
    }
    if (status.run === 1) {
      setStatusTxt("install完毕，正在启动");
    } else if (status.run === 2) {
      setStatusTxt("install完毕，项目已启动");
    }
  };

  const submit = () => {
    form.validateFields().then(async (values) => {
      console.log(values);
      const { gitPath, local, projectPath } = values;

      let fileName: string;
      let localPath: string;
      if (local === "1") {
        fileName = projectPath.slice(projectPath.lastIndexOf("/") + 1);
        localPath = projectPath.slice(0, projectPath.lastIndexOf("/"));
      } else {
        fileName = gitPath.slice(gitPath.lastIndexOf("/") + 1, -4);
        localPath = projectPath;
      }

      // @ts-ignore
      window.ipcRenderer.send("add-project", {
        ...values,
        fileName,
        projectPath: localPath,
      });
    });
  };

  const chooseDir = () => {
    //@ts-ignore
    const res = window.ipcRenderer.sendSync("choose-dir");
    const index = res.filePath.lastIndexOf("/");
    form.setFieldsValue({ projectPath: res.filePath.slice(0, index) });
  };

  const cancel = () => {
    setVisible(false);
    form.resetFields();
    setStatus({ added: 0, run: 0, install: 0 });
  };

  return (
    <Modal
      title="添加项目"
      visible={visible}
      closable={false}
      style={{ top: 20 }}
      footer={[
        <Button key="back" onClick={cancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={submit}>
          保存
        </Button>,
      ]}
    >
      <Form {...layout} form={form}>
        <Form.Item
          label="项目名称"
          name="projectName"
          className={styles.formItem}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="git仓库地址"
          name="gitPath"
          className={styles.formItem}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="本地存放路径"
          name="projectPath"
          className={styles.formItem}
        >
          <Input onClick={chooseDir} />
        </Form.Item>
        <Form.Item label="备注" name="desc" className={styles.formItem}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="本地已有项目"
          name="local"
          className={styles.formItem}
        >
          <Radio.Group>
            <Radio value="1">是</Radio>
            <Radio value="2">否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="是否install"
          name="install"
          className={styles.formItem}
        >
          <Radio.Group>
            <Radio value="1">是</Radio>
            <Radio value="2">否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="是否运行项目" name="run" className={styles.formItem}>
          <Radio.Group>
            <Radio value="1">是</Radio>
            <Radio value="2">否</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="运行命令" name="command" className={styles.formItem}>
          <Input />
        </Form.Item>
      </Form>
      {status.install !== 0 || status.run !== 0 ? (
        <div>
          {status.install === 1 || status.run === 1 ? (
            <LoadingOutlined />
          ) : null}
          <span style={{ marginLeft: 10 }}>{statusTxt}</span>
        </div>
      ) : null}
    </Modal>
  );
};

export default AddProject;
