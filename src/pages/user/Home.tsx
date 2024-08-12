import React, { useCallback, useEffect, useState } from "react";
import { Layout, Menu, Input, Tooltip, Drawer, Button, Badge } from "antd";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import "../../styles/User.scss";
import {
  LogoutOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  MenuOutlined,
  ShoppingOutlined,
  EyeOutlined
} from "@ant-design/icons";
import { useUser } from "../../contexts/UserContext";
import SubMenu from "antd/es/menu/SubMenu";
import {
  CART,
  HOME,
  LOGIN,
  MYPURCHASE,
  PRODUCTS,
  RECENTLY_VIEWED,
  REGISTER,
  USER,
} from "../../routes";
import { refreshToken } from "../../utils/help";
import { useTranslation } from "react-i18next";
import Cart from "./components/Cart";

const { Header, Content } = Layout;
const { Search } = Input;

const User: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultSelectedKey = location.pathname.includes("/category")
    ? "2"
    : "1";
  const { user, setUser } = useUser();
  const [searchText, setSearchText] = useState("");
  const [visible, setVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = useCallback((count: number) => {
    setCartCount(count);
  }, []);

  useEffect(() => {
    refreshToken(navigate);
  }, []);

  useEffect(() => {
    if (location.state?.user) {
      setUser(location.state.user);
    }
  }, [location.state, setUser]);

  useEffect(() => {
    i18n.on("languageChanged", (lng) => {
      setLanguage(lng);
    });
  }, [i18n]);

  useEffect(() => {
    if (user) {
      const cart = JSON.parse(localStorage.getItem("cart") || '[]');
      const userCart = cart.filter((item: any) => item.user.id === user.id);
      setCartCount(userCart.length);
    }
  }, [user]);

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "login") {
      navigate(LOGIN);
    } else if (key === "register") {
      navigate(REGISTER);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value.trim());
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    navigate(HOME);
  };

  const handleClickPurchase = () => {
    navigate(`${USER}/${MYPURCHASE}`, {
      state: { user: user, token: location.state?.token },
    });
  };
  
  const  handleClickRecentlyViewed = () => {
    navigate(`${USER}/${RECENTLY_VIEWED}`, {
      state: { user: user, token: location.state?.token },
    });
  };

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "vi" : "en";
    i18n.changeLanguage(newLanguage);
  };

  const handleCartClick = () => {
    navigate(`${USER}/${CART}`,{ state: { token: location.state?.token }});
  };


  return (
    <Layout>
      <Header className="header">
        <div className="logo" onClick={() => navigate(`${USER}/${PRODUCTS}`)}>
          <img src="../../../public/logo.svg" alt="" className="logo-icon" />
          <img src="../../../public/name.svg" alt="" className="logo-name" />
        </div>
        <div className="header-feature">
          <Search
            placeholder={t("search")}
            enterButton
            value={searchText}
            onSearch={handleSearch}
            onChange={handleSearchChange}
            size="large"
            className="search-input"
          />
          <div className="cart">
            <Tooltip title={t('shopping-cart')}>
            <Badge count={cartCount} showZero>
                <ShoppingCartOutlined className="cart-icon" onClick={handleCartClick}/>
              </Badge>
            </Tooltip>
          </div>
          <div className="translation">
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
          </div>

          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={[defaultSelectedKey]}
            onClick={handleMenuClick}
            className="menu"
          >
            {user ? (
              <SubMenu
                key="user"
                title={`${t("hi")} ${user.name}`}
                icon={<UserOutlined />}
              >
                <Menu.Item key="purchase" onClick={handleClickPurchase}>
                  <ShoppingOutlined style={{ marginRight: "10px" }} />{" "}
                  {t("purchase")}
                </Menu.Item>
                <Menu.Item key="recently-viewed" onClick={handleClickRecentlyViewed}>
                  <EyeOutlined  style={{ marginRight: "10px" }} />{" "}
                  {t("recently-viewed")}
                </Menu.Item>
                <Menu.Item key="logout" onClick={handleLogout}>
                  <LogoutOutlined style={{ marginRight: "10px" }} />{" "}
                  {t("logout")}
                </Menu.Item>
              </SubMenu>
            ) : (
              <>
                <Menu.Item key="login">{t("login")}</Menu.Item>
                <Menu.Item key="register">{t("register")}</Menu.Item>
              </>
            )}
          </Menu>
          <div className="mobile-menu">
            <Button
              type="default"
              icon={<MenuOutlined />}
              onClick={showDrawer}
            />
            <Drawer
              title="Menu"
              placement="right"
              onClose={onClose}
              open={visible}
            >
              <Menu
                theme="light"
                mode="vertical"
                defaultSelectedKeys={[defaultSelectedKey]}
                onClick={handleMenuClick}
              >
                {user ? (
                  <SubMenu
                    key="user"
                    title={`${t("hi")} ${user.name}`}
                    icon={<UserOutlined />}
                  >
                    <Menu.Item key="purchase" onClick={handleClickPurchase}>
                      <ShoppingOutlined style={{ marginRight: "10px" }} />{" "}
                      {t("purchase")}
                    </Menu.Item>
                    <Menu.Item
                      key="logout"
                      className="logout-menu-item"
                      onClick={handleLogout}
                    >
                      <LogoutOutlined style={{ marginRight: "10px" }} />{" "}
                      {t("logout")}
                    </Menu.Item>
                  </SubMenu>
                ) : (
                  <>
                    <Menu.Item key="login">{t("login")}</Menu.Item>
                    <Menu.Item key="register">{t("register")}</Menu.Item>
                  </>
                )}
              </Menu>
            </Drawer>
          </div>
        </div>
      </Header>
      <Layout className="site-layout">
        <Content>
        {location.pathname === `${USER}/${CART}` ? (
          <Cart updateCartCount={updateCartCount} />
        ) : (
          <Outlet context={{ searchText, updateCartCount }} />
        )}
          
        </Content>
      </Layout>
    </Layout>
  );
};

export default User;
