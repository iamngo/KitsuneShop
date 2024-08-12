import React, { useEffect, useState } from "react";
import { List, Button, message, Modal, InputNumber, Breadcrumb, Image } from "antd";
import { useUser } from "../../../contexts/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { createPurchase } from "../../../services/api";
import { PRODUCTS, PURCHASE_DETAIL, USER } from "../../../routes";
import { useTranslation } from "react-i18next";
import { DeleteFilled } from "@ant-design/icons";

const { confirm } = Modal;

const Cart: React.FC<{ updateCartCount: (count: number) => void }> = ({ updateCartCount }) => {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const token = location.state?.token;

  useEffect(() => {
    if (user) {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const userCart = cart
        .filter((item: any) => item.user.id === user.id);
        console.log(userCart);
        
      setCartItems(userCart);
    }
  }, [user]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const showRemoveMessage = (success: boolean) => {
    if (success) {
      message.success(t("SUCCESS.remove-from-cart"));
    } else {
      message.error(t("ERROR.remove-from-cart"));
    }
  };

  const removeItemFromCart = (itemId: string) => {
    const updatedCart = cartItems.filter((item) => item.product.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCartCount(updatedCart.length);
    return updatedCart.length !== cartItems.length;
  };

  const handleRemoveItem = (itemId: string) => {
    try {
      const success = removeItemFromCart(itemId);
      showRemoveMessage(success);
    } catch (error) {
      console.error(error);
      showRemoveMessage(false);
    }
  };

  const handleBuyNow = (product: any) => {
    const actualPrice = (
      parseFloat(product.product.basePrice) *
      (1 - product.product.discountPercentage / 100)
    ).toFixed(2);

    const messageContent = t("purchaseConfirmationMessage", {
      quantity: product.quantity,
      productName: product.product.name,
      price: actualPrice,
    });
    confirm({
      title: t("confirm-purchase"),
      content: messageContent,
      onOk: () => executePurchase(product),
    });
  };

  const executePurchase = async (product: any) => {
    try {
      const response = await createPurchase(
        { productId: product.product.id, amount: product.quantity },
        token
      );
      if (response) {
        message.success({
          content: (
            <span>
              {t("SUCCESS.purchase")}{" "}
              <a
                onClick={() =>
                  navigate(`${USER}/${PURCHASE_DETAIL}/${response.id}`, {
                    state: {
                      token: token,
                      purchaseId: response.id,
                      user: user,
                    },
                  })
                }
              >
                {t("view-detail")}
              </a>
            </span>
          ),
        });
        removeItemFromCart(product.product.id);
      } else {
        message.error(t("ERROR.purchase"));
      }
    } catch (error) {
      message.error(t("ERROR.purchase"));
      console.error(error);
    }
  };

  const handleQuantityChange = (itemId: string, value: number) => {
    const updatedCart = cartItems.map((item) => {
      if (item.product.id === itemId) {
        return { ...item, quantity: value };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCartCount(updatedCart.length);
  };

  return (
    <div className="cart-page">
      <Breadcrumb >
        <Breadcrumb.Item
          onClick={() =>
            navigate(`${USER}/${PRODUCTS}`, {
              state: { token: location.state.token },
            })
          }
        >
          {t("home")}
        </Breadcrumb.Item>
        <Breadcrumb.Item>{t("my-cart")}</Breadcrumb.Item>
      </Breadcrumb>
      <h1>{t("my-cart")}</h1>
      <List
        itemLayout="horizontal"
        dataSource={cartItems}
        renderItem={(item: any) => (
          <List.Item
            actions={[
              <Button type="primary" onClick={() => handleBuyNow(item)}>
                {t("buy-now")}
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => handleRemoveItem(item.product.id)}
                icon={<DeleteFilled />}
              ></Button>,
            ]}
          >
            <List.Item.Meta
              title={item.product.name}
              description={`${t('price')}: $${item.product.basePrice}`}
              avatar={
                item.product.picture ? (
                  <Image
                    className="image"
                    src={`http://${item.product.picture}`}
                    alt={item.product.name}
                  />
                ) : (
                  <Image
                    className="image"
                    src="error"
                    alt="default"
                    fallback="data:image/png;base64,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"
                  />
                )
              }
            />
            <div className="quantity">
              <span>{t('quantity')}: </span>
              <InputNumber
                min={1}
                max={item.product.stock}
                value={item.quantity}
                onChange={(value) =>
                  handleQuantityChange(item.product.id, value)
                }
              />
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Cart;
