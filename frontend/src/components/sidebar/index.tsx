import { CodeOutlined } from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import styles from "@/styles/Home.module.css";
import { Tabs } from "antd";
import { TabsProps } from "antd";
import CodeEditor from "../codeEditor";

const { Header, Content, Footer, Sider } = Layout;

const items: TabsProps["items"] = [
  {
    key: "1",
    label: `Problem Statement`,
    children: (
      <div>
        <h3>Add 2 Numbers</h3>
        <div>
          Write a code for adding 2 integer numbers. Complete the add function
          given. The function accepts 2 parameters a & b as input & expects
          their addition as the returned response.
        </div>
      </div>
    ),
  },
];

const Sidebar = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Sider trigger={null} collapsed={false}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <CodeOutlined rev={undefined} />,
              label: "Add 2 Numbers",
            },
            {
              key: "2",
              icon: <CodeOutlined rev={undefined} />,
              label: "Factorial of a Number",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <div className={styles.main}>
            <div className={styles.problem}>
              <Tabs defaultActiveKey="1" items={items} />
            </div>
            <CodeEditor />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
