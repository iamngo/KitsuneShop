import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  Image,
  Skeleton,
  Button,
  Tag,
  InputNumber,
  message,
  Breadcrumb,
  Modal,
} from "antd";
import { getProductByUrlName, createPurchase } from "../../../services/api";
import "../../../styles/User.scss";
import { useUser } from "../../../contexts/UserContext";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { LOGIN, PRODUCTS, PURCHASE_DETAIL, USER } from "../../../routes";
import { useTranslation } from "react-i18next";
import RecentlyViewed from "./RecentlyViewed";

const { confirm } = Modal;

interface Category {
  name: string;
}

interface Product {
  id: string;
  name: string;
  urlName: string;
  picture: string;
  basePrice: string;
  discountPercentage: number;
  stock: number;
  description: string;
  createdAt: string;
  categories: Category[];
}

const ProductDetail: React.FC = () => {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const colors = [
    "blue",
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "geekblue",
    "purple",
  ];
  const [quantity, setQuantity] = useState<number>(1);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.on("languageChanged", () => {});
  }, [i18n]);

  const fetchProductDetails = (urlName: string) => {
    getProductByUrlName(urlName)
      .then((response) => {
        setProduct(response);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        message.error(t('ERROR.fetch-product-details'));
      });
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (location.state && location.state.urlName) {
      fetchProductDetails(location.state.urlName);
    }
  }, [location.state.urlName]);

  if (!product) {
    return (
      <Card className="product-detail-card">
        <div className="product-detail-content">
          <div className="product-image-container">
            <Skeleton.Image active className="product-image" />
          </div>
          <div className="product-info">
            <Skeleton paragraph={{ rows: 4 }} active />
          </div>
        </div>
      </Card>
    );
  }

  const actualPrice = (
    parseFloat(product.basePrice) *
    (1 - product.discountPercentage / 100) *
    quantity
  ).toFixed(2);

  const handleBuyProduct = () => {
    if (!user) {
      message.error(t('ERROR.please-login'));
      navigate(LOGIN);
    } else {
      const message = t("purchaseConfirmationMessage", {
        quantity,
        productName: product.name,
        price: actualPrice,
      });
      confirm({
        title: t("confirm-purchase"),
        content: message,
        onOk: executePurchase,
      });
    }
  };

  const executePurchase = async () => {
    try {
      const response = await createPurchase(
        { productId: product.id, amount: quantity },
        location.state.token
      );
      if (response) {
        message.success({
          content: (
            <span>
              {t('SUCCESS.purchase')}{" "}
              <a
                onClick={() =>
                  navigate(`${USER}/${PURCHASE_DETAIL}/${response.id}`, {
                    state: {
                      token: location.state.token,
                      purchaseId: response.id,
                      user: user,
                    },
                  })
                }
              >
                {t('view-detail')}
              </a>
            </span>
          ),
        });
      } else {
        message.error(t('ERROR.purchase'));
      }
    } catch (error) {
      message.error(t('ERROR.purchase'));
      console.error(error);
    }
  };

  const handleQuantityChange = (value: number | null) => {
    if (value) {
      setQuantity(value);
    }
  };

  return (
    <div className="product-detail">
      <Breadcrumb style={{ margin: "0 40px 16px 40px" }}>
        <Breadcrumb.Item
          onClick={() =>
            navigate(`${USER}/${PRODUCTS}`, {
              state: { token: location.state.token },
            })
          }
        >
          {t("home")}
        </Breadcrumb.Item>
        <Breadcrumb.Item
          onClick={() =>
            navigate(`${USER}/${PRODUCTS}`, {
              state: { token: location.state.token },
            })
          }
        >
          {t("list")}
        </Breadcrumb.Item>
        <Breadcrumb.Item>{t("product-details")}</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="product-detail-card">
        <div className="product-detail-content">
          <div className="product-image-container">
            {product.picture ? (
              <Image
                className="product-image"
                src={`http://${product.picture}`}
                alt={product.name}
              />
            ) : (
              <Image
                className="product-image"
                src="error"
                fallback="data:image/png;base64,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"
              />
            )}
          </div>
          <div className="product-info">
            <h1>{product.name}</h1>
            <p className="product-info-price">
              <del> ${product.basePrice}</del>
              <strong>${actualPrice}</strong>
              <span>{product.discountPercentage}% OFF</span>
            </p>

            <p>
              <span>{t("category")}:</span>{" "}
              {product.categories.map((category, index) => (
                <Tag
                  key={index}
                  color={colors[index % colors.length]}
                  style={{ padding: "2px 5px", fontWeight: "bold" }}
                >
                  {category.name}
                </Tag>
              ))}
            </p>
            <p>
              <span>{t("description")}:</span> {product.description}
            </p>

            <p>
              <span>{t("quantity")}:</span>
              <InputNumber
                min={1}
                max={product.stock}
                defaultValue={1}
                onChange={handleQuantityChange}
              />
              <i style={{ marginLeft: "10px" }}>
                ({product.stock} {t("pieces")})
              </i>
            </p>
            <div className="btn-feature">
              <Button size="large" type="default" onClick={handleBuyProduct}>
                {t("add-to-cart")}
                <ShoppingCartOutlined />
              </Button>
              <Button size="large" type="primary" onClick={handleBuyProduct}>
                {t("buy-now")}
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <RecentlyViewed />
    </div>
  );
};

export default ProductDetail;
