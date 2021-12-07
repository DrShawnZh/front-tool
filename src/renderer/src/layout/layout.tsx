import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getSettings } from "../store/global";
import { Layout, Menu } from "antd";
import { Route, Link, Switch } from "react-router-dom";
import styles from "./layout.less";
import InitPage from "@/pages/init";
import GitPage from "@/pages/git";
import PdfPage from "@/pages/pdf";
import Setting from "@/pages/setting";

const { Sider, Content } = Layout;

console.log(styles);

const BasicLayout: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    getSettingsF();
  }, []);

  const getSettingsF = async () => {
    await dispatch(getSettings());
  };

  return (
    <Layout className={styles.layout}>
      <Sider className={styles.sider}>
        <Menu>
          <Menu.Item>
            <Link to="/node">node</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/git">project</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/setting">set</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Content className={styles.wrapper}>
        <Switch>
          <Route path="/node">
            <InitPage />
          </Route>
          <Route path="/git">
            <GitPage />
          </Route>
          <Route path="/setting">
            <Setting />
          </Route>
        </Switch>
      </Content>
    </Layout>
  );
};

export default BasicLayout;
