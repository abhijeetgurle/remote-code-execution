import { CodeOutlined } from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import styles from "@/styles/Home.module.css";
import CodeEditor from "../codeEditor";
import { programs } from "@/utils/constant";
import { useState } from "react";

const { Content, Sider } = Layout;

const Sidebar = () => {
  const [selectedTab, setSelectedTab] = useState<number>(1);
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
          onClick={(e) => setSelectedTab(Number(e.key))}
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
              <div>
                <h3>{programs[selectedTab - 1].title}</h3>
                <div>{programs[selectedTab - 1].problem}</div>
              </div>
            </div>
            <CodeEditor
              problemId={programs[selectedTab - 1].id}
              baseCode={programs[selectedTab - 1].baseCode}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
