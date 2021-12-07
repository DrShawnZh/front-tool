import React from "react";
import { Tabs } from "antd";
import GitForm from "./components/git";
import CommonForm from "./components/common";

const Setting: React.FC = () => {

  return (
    <div>
      <Tabs defaultActiveKey="git">
        <Tabs.TabPane tab="git" key="git">
          <GitForm />
        </Tabs.TabPane>
        <Tabs.TabPane tab="common" key="common">
          <CommonForm />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Setting;
