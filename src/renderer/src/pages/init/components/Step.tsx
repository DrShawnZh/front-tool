import React, { useState, useEffect } from "react";
import { Steps } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const { Step } = Steps;
interface InitEnv {
  setVList(list: string[]): void;
}

const InitEnv: React.FC<InitEnv> = ({ setVList }) => {
  const [curStep, setCurStep] = useState<number>(0);
  const [handleList, setHandleList] = useState<
    {
      title: string;
      status: string;
      desc: string;
    }[]
  >([
    {
      title: "检测Node环境",
      status: "wait",
      desc: "正在检测机器的node环境...",
    },
    {
      title: "检测node版本号",
      status: "wait",
      desc: "获取机器所有的node版本号",
    },
    {
      title: "检测完毕",
      status: "wait",
      desc: "检测完毕",
    },
  ]);

  // @ts-ignore
  useEffect(async () => {
    await initEnv();
    await getNodeV();
    // testNpmi();
  }, []);

  const initEnv = async () => {
    console.log("初始化。。。。");
    // @ts-ignore
    const res = window.ipcRenderer.sendSync("init-env");
    console.log(res, 'res');
    setHandleList((list) => {
      list[0].desc = `已安装node，当前版本${res?.trunk}`;
      return [...list];
    });
    setCurStep(1);
  };

  const getNodeV = async () => {
    console.log("获取Node版本");
    // @ts-ignore
    const res = window.ipcRenderer.sendSync("get-node-version");
    setVList(res.trunk.split("\n"));
    setHandleList((list) => {
      list[1].desc = `已获取到机器node版本信息`;
      return [...list];
    });
    setCurStep(3);
  };

  // const testNpmi = async () => {
  //   console.log('测试 npm install');
  //   // @ts-ignore
  //   const res = window.ipcRenderer.sendSync('test-npm-install');
  //   console.log(res);
  // }

  return (
    <Steps current={curStep} direction="vertical">
      {handleList.map((item, index) => (
        <Step
          key={index}
          title={item.title}
          description={item.desc}
          icon={curStep === index ? <LoadingOutlined /> : null}
        />
      ))}
    </Steps>
  );
};

export default InitEnv;
