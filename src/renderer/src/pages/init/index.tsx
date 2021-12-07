import React, { useEffect, useState } from "react";
import StepCom from "./components/Step";
import VManager from "./components/VManager";
import { Tabs } from "antd";
const { TabPane } = Tabs;

const InitEnv: React.FC = () => {
  useEffect(() => {}, []);

  const [vList, setVList] = useState<string[]>([]);

  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="环境检测" key="1">
          <StepCom setVList={setVList} />
        </TabPane>
        <TabPane tab="node管理" key="2">
          <VManager vList={vList} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default InitEnv;
