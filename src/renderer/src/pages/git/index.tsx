import React, { useEffect, useState } from "react";
import AddProject from "./components/addProject";
import { Button, Table, Modal, message } from "antd";
import {
  FolderOpenOutlined,
  CodeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

interface ProjectItemVo {
  projectName: string;
  projectPath: string;
  gitPath?: string;
  desc?: string;
  id?: string;
  [k: string]: any;
}

const Project: React.FC = () => {
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [list, setList] = useState<ProjectItemVo[]>([]);

  useEffect(() => {
    getProjects();
  }, []);

  const getProjects = () => {
    // @ts-ignore
    const res = window.ipcRenderer.sendSync("get-projects-list");
    console.log(res);
    setList(res);
  };

  const copy = (path: string) => {
    // @ts-ignore
    window.clipboard.writeText(path);
  };

  const openDir = (path: string) => {
    // @ts-ignore
    window.ipcRenderer.sendSync("open-dir", path);
  };

  const openVscode = (path: string) => {
    // @ts-ignore
    window.ipcRenderer.send("code-dir", path);
  };

  const deletePro = (id: string) => {
    Modal.confirm({
      title: "确认删除此项目",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        // @ts-ignore
        const res = await window.ipcRenderer.sendSync("delete-project", id);
        console.log(res);
        if (res.success) {
          message.success("删除成功");
          getProjects();
        }
      },
    });
  };

  const columns: any = [
    {
      title: "项目名称",
      dataIndex: "projectName",
      key: "projectName",
      width: 60,
    },
    {
      title: "项目地址",
      dataIndex: "projectPath",
      key: "projectPath",
      width: 100,
      ellipsis: true,
      render: (path: string) => <a onClick={() => copy(path)}>{path}</a>,
    },
    {
      title: "git地址",
      dataIndex: "gitPath",
      key: "gitPath",
      width: 100,
      ellipsis: true,
      render: (path: string) => <a onClick={() => copy(path)}>{path}</a>,
    },
    {
      title: "操作",
      dataIndex: "handle",
      key: "handle",
      width: 60,
      render: (_: string, record) => {
        return (
          <>
            <a
              type="link"
              style={{ marginRight: 20 }}
              onClick={() =>
                openDir(`${record.projectPath}/${record.fileName}`)
              }
            >
              <FolderOpenOutlined />
            </a>
            <a
              type="link"
              style={{ marginRight: 20 }}
              onClick={() =>
                openVscode(`${record.projectPath}/${record.fileName}`)
              }
            >
              <CodeOutlined />
            </a>
            <a type="link" onClick={() => deletePro(record.id)}>
              <DeleteOutlined />
            </a>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <p style={{ textAlign: "right" }}>
        <Button size="small" type="primary" onClick={() => setShowAdd(true)}>
          添加项目
        </Button>
      </p>
      <Table
        columns={columns}
        dataSource={list}
        size="small"
        pagination={false}
      />
      <AddProject
        visible={showAdd}
        setVisible={setShowAdd}
        refresh={getProjects}
      />
    </div>
  );
};

export default Project;
