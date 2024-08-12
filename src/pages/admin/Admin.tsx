import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import "../../styles/Admin.scss";
import { LogoutOutlined } from "@ant-design/icons";
import { ADMIN, CATEGORIES, LOGIN, MYPURCHASE, PRODUCTS } from "../../routes";
import { refreshToken } from "../../utils/help";
import { useTranslation } from "react-i18next";

const { Content, Sider } = Layout;

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultSelectedKey = location.pathname.includes("/category")
    ? "2"
    : "1";
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "1") {
      navigate(`${ADMIN}/${PRODUCTS}`, { state: { token: location.state.token } });
    } else if (key === "2") {
      navigate(`${ADMIN}/${CATEGORIES}`, { state: { token: location.state.token } });
    } else if (key === "3") {
      navigate(`${ADMIN}/${MYPURCHASE}`, { state: { token: location.state.token } });
    }
  };

  useEffect(() => {
    refreshToken(navigate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    navigate(LOGIN);
  };
  
  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "vi" : "en";
    i18n.changeLanguage(newLanguage);
    
  };

  return (
    <Layout>
      <Sider collapsible>
        <h1 className="logo">ADMIN</h1>
        <Menu
          theme="dark"
          defaultSelectedKeys={[defaultSelectedKey]}
          mode="inline"
          onClick={handleMenuClick}
        >
          <Menu.Item key="1">Products</Menu.Item>
          <Menu.Item key="2">Categories</Menu.Item>
          <Menu.Item key="3">Purchases</Menu.Item>
          <Menu.Item onClick={handleLogout}>
            {`Logout `}
            <LogoutOutlined />
          </Menu.Item>
        </Menu>
        {/* <div className="translation">
            <button
              onClick={toggleLanguage}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={
                  language === "vi"
                    ? "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1200px-Flag_of_Vietnam.svg.png"
                    : "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
                }
                alt={language === "vi" ? "Vietnamese Flag" : "US Flag"}
                style={{ width: "20px", height: "20px", marginRight: "2px" }}
              />
              {language === "vi" ? "Vi" : "En"}
            </button>
          </div> */}
      </Sider>
      <Layout className="site-layout">
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admin;
