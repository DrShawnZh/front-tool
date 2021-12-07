import React, { useEffect, useState } from "react";
import { List, Modal, message, Button } from "antd";
import styles from "../index.less";

interface VManagerProps {
  vList: string[];
}

const VManager: React.FC<VManagerProps> = ({ vList }) => {
  const [list, setVList] = useState<string[]>();
  const [cur, setCur] = useState<string>("");

  useEffect(() => {
    // console.log(`v${vList[0].slice(5)}` === 'v12.8.1');
    setVList(vList.map((item) => item.slice(5)));
    getV();
  }, [vList]);

  const deleteV = (v: string) => {
    Modal.confirm({
      title: "确认删除此node版本",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        // @ts-ignore
        const res = window.ipcRenderer.sendSync("delete-node-v", v.slice(5));
        if (res.success) {
          message.success("删除成功");
          await getNodeV();
        }
      },
    });
  };

  const switchV = (v: string) => {
    Modal.confirm({
      title: "确认切换至此node版本",
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        // @ts-ignore
        const res = window.ipcRenderer.sendSync("switch-node-v", v);
        console.log(res);
        if (res.success) {
          message.success("切换成功");
          getV();
        }
      },
    });
  };

  const getNodeV = async () => {
    console.log("获取Node版本");
    // @ts-ignore
    const res = window.ipcRenderer.sendSync("get-node-version");
    setVList(
      res.trunk.split("\n").map((item: string) => item && item.slice(5))
    );
  };

  const getV = async () => {
    console.log("获取当前node版本。。。。");
    // @ts-ignore
    const res = window.ipcRenderer.sendSync("init-env");
    console.log(res, 'res');
    setCur(res.trunk);
  };

  return (
    <div>
      <p>
        当前使用的node版本 <strong>{cur}</strong>
      </p>
      <List
        dataSource={list}
        renderItem={(item: string) => {
          if (!item) return null;
          return (
            <p className={styles.vItem}>
              <span>v{item}</span>
              <span>
                <Button
                  type="link"
                  onClick={() => deleteV(item)}
                  disabled={cur.slice(0, -1) === `v${item}`}
                >
                  删除
                </Button>
                <Button type="link" onClick={() => switchV(item)}>
                  切换
                </Button>
              </span>
            </p>
          );
        }}
      />
    </div>
  );
};

export default VManager;
