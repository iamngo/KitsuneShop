import React, { useEffect, useMemo, useState } from "react";
import {
  message,
  Skeleton,
  Image,
  Select,
  Card,
  Button,
  Carousel,
  List,
  Tooltip,
  Breadcrumb,
  Slider,
  Empty,
  Dropdown,
  Menu,
} from "antd";
import {
  UnorderedListOutlined,
  AppstoreOutlined,
  LeftOutlined,
  RightOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { getAllProduct, getAllCategory } from "../../../services/api";
import { useDebounce } from "../../../hooks/useDebounce";
import "../../../styles/User.scss";
import { PRODUCT_DETAIL, USER } from "../../../routes";
import { t } from "i18next";
import { useUser } from "../../../contexts/UserContext";

const { Option } = Select;

interface Category {
  name: string;
}
interface Product {
  id: string;
  name: string;
  picture: string;
  basePrice: number;
  stock: number;
  discountPercentage: number;
  urlName: string;
  description: string;
  categories: Category[];
}

const Products: React.FC = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const { searchText, updateCartCount } = useOutletContext<{
    searchText: string;
    updateCartCount: (count: number) => void;
  }>();
  const navigate = useNavigate();
  const [viewType, setViewType] = useState("card");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const debouncedSearchText = useDebounce(searchText, 1000);
  const location = useLocation();
  const [productsPerRow, setProductsPerRow] = useState(0);

  const fetchProducts = (
    productName: string,
    page: number,
    size: number
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      getAllProduct(productName, page, size)
        .then((response) => {
          setAllProducts(response);
          setLoading(false);
          resolve();
        })
        .catch((error) => {
          message.error(t("ERROR.fetch-products"));
          setLoading(false);
          reject(error);
        });
    });
  };

  const fetchCategories = () => {
    getAllCategory("", 1, 100)
      .then((response) => {
        setCategories(response);
      })
      .catch(() => {
        message.error(t("ERROR.fetch-categories"));
      });
  };

  useEffect(() => {
    fetchProducts(debouncedSearchText, 1, pageSize);
    fetchCategories();
  }, [debouncedSearchText, pageSize]);

  const filteredProducts = useMemo(() => {
    let productsToDisplay = allProducts;
    if (selectedCategory) {
      productsToDisplay = productsToDisplay.filter((product) =>
        product.categories.some((cat) => cat.name === selectedCategory)
      );
    }
    return productsToDisplay.filter(
      (product) =>
        product.basePrice >= priceRange[0] && product.basePrice <= priceRange[1]
    );
  }, [allProducts, priceRange, selectedCategory]);

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);
    fetchProducts(debouncedSearchText, 1, value);
  };

  const handleProductClick = (product: Product) => {
    let viewedProducts = JSON.parse(localStorage.getItem("viewedProducts") || "[]");
    
    const existingProductIndex = viewedProducts.findIndex(
      (item: Product) => item.id === product.id
    );
  
    if (existingProductIndex === -1) {
      viewedProducts.push(product);
      localStorage.setItem("viewedProducts", JSON.stringify(viewedProducts));
    }
  
    navigate(`${USER}/${PRODUCT_DETAIL}/${product.urlName}`, {
      state: { urlName: product.urlName, token: location.state?.token },
    });
  };
  

  const addToCart = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProductIndex = cart.findIndex(
      (item: { product: Product }) => item.product.id === product.id
    );
    if (existingProductIndex > -1) {
      cart[existingProductIndex].quantity =
        (cart[existingProductIndex].quantity || 1) + 1;
    } else {
      cart.push({ user, product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount(cart.length);
    message.success(t("SUCCESS.add-to-cart"));
  };

  const renderProductList = (products: Product[]) => (
    <List
      itemLayout="horizontal"
      dataSource={products}
      renderItem={(product) => {
        const actualPrice =
          product.basePrice -
          (product.basePrice * product.discountPercentage) / 100;
        return (
          <List.Item
            onClick={() => handleProductClick(product.urlName)}
            className="list-item"
          >
            <List.Item.Meta
              className="list-item-meta"
              avatar={
                product.picture ? (
                  <Image
                    className="image"
                    src={`http://${product.picture}`}
                    alt={product.name}
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
              description={
                <div className="product-description">
                  <div className="product-details-left">
                    <div className="product-name">{product.name}</div>
                    <span className="desc-desktop">{product.description}</span>
                    <span className="desc-mobile">
                      {product.description.length > 40
                        ? `${product.description.substring(0, 40)}...`
                        : product.description}
                    </span>
                    <span className="desc-tablet">
                      {product.description.length > 110
                        ? `${product.description.substring(0, 110)}...`
                        : product.description}
                    </span>
                  </div>
                  <div className="product-details-right">
                    <div className="price-section">
                      <span className="actual-price">
                        ${actualPrice.toFixed(2)}
                      </span>
                      <del className="base-price">${product.basePrice}</del>
                      <span className="discount-percentage">
                        - {product.discountPercentage}%
                      </span>
                    </div>
                    <div className="btn-feature">
                      <Button type="default" size="large">
                        {t("view-detail")}
                      </Button>
                      <Button
                        type="primary"
                        size="large"
                        onClick={(event) => addToCart(product, event)}
                      >
                        {t("add-to-cart")} <ShoppingCartOutlined />
                      </Button>
                    </div>
                  </div>
                </div>
              }
            />
          </List.Item>
        );
      }}
    />
  );

  const renderProductCard = (products: Product[]) => (
    <div
      className="product-card-container"
      style={{ gridTemplateColumns: `repeat(${productsPerRow}, 1fr) ` }}
    >
      {products.map((product) => {
        const actualPrice =
          product.basePrice -
          (product.basePrice * product.discountPercentage) / 100;
        return (
          <Card
            onClick={() => handleProductClick(product)}
            hoverable
            key={product.id}
            className="product-card"
            style={{ width: productsPerRow === 2 ? "192px" : "" }}
            cover={
              product.picture ? (
                <img alt={product.name} src={`http://${product.picture}`} />
              ) : (
                <Image
                  className="img-default"
                  src="error"
                  fallback="data:image/png;base64,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"
                />
              )
            }
          >
            <Card.Meta
              title={product.name}
              description={
                <div className="card-description">
                  <span className="card-price">
                    ${actualPrice.toFixed(2)}
                    <del>${product.basePrice}</del>
                  </span>
                  <Tooltip title="Add to cart">
                    <Button
                      type="primary"
                      size="large"
                      icon={<ShoppingCartOutlined />}
                      onClick={(event) => addToCart(product, event)}
                    ></Button>
                  </Tooltip>
                </div>
              }
            />
            <div className="discount">- {product.discountPercentage}%</div>
          </Card>
        );
      })}
    </div>
  );

  const handleProductsPerRowChange = (value: number) => {
    setProductsPerRow(value);
  };

  const menu = (
    <>
      <Menu
        className="desktop-menu-gird"
        onClick={(e) => handleProductsPerRowChange(parseInt(e.key, 10))}
      >
        <Menu.Item key="3">3 {t("per-row")}</Menu.Item>
        <Menu.Item key="4">4 {t("per-row")}</Menu.Item>
        <Menu.Item key="5">5 {t("per-row")}</Menu.Item>
        <Menu.Item key="6">6 {t("per-row")}</Menu.Item>
      </Menu>
      <Menu
        className="tablet-menu-gird"
        onClick={(e) => handleProductsPerRowChange(parseInt(e.key, 10))}
      >
        <Menu.Item key="2">2 {t("per-row")}</Menu.Item>
        <Menu.Item key="3">3 {t("per-row")}</Menu.Item>
      </Menu>
      <Menu
        className="mobile-menu-gird"
        onClick={(e) => handleProductsPerRowChange(parseInt(e.key, 10))}
      >
        <Menu.Item key="1">1 {t("per-row")}</Menu.Item>
        <Menu.Item key="2">2 {t("per-row")}</Menu.Item>
      </Menu>
    </>
  );

  const handleViewTypeChange = (value: string) => {
    setLoading(true);
    setTimeout(() => {
      setViewType(value);
      setLoading(false);
    }, 200);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchProducts(debouncedSearchText, newPage, pageSize);
    }
  };

  const handleNext = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    fetchProducts(debouncedSearchText, newPage, pageSize);
  };

  const handleCategoryChange = (value: string) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedCategory(value);
      setLoading(false);
    }, 200);
  };

  return (
    <div className="products">
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item>{t("home")}</Breadcrumb.Item>
        <Breadcrumb.Item>{t("list")}</Breadcrumb.Item>
      </Breadcrumb>
      <Carousel autoplay>
        <img
          src="../../../public/banner/banner1.png"
          alt=""
          className="carousel-img"
        />
        <img
          src="../../../public/banner/banner2.png"
          alt=""
          className="carousel-img"
        />
        <img
          src="../../../public/banner/banner3.png"
          alt=""
          className="carousel-img"
        />
        <img
          src="../../../public/banner/banner4.png"
          alt=""
          className="carousel-img"
        />
      </Carousel>
      <div className="product-list-header">
        <div className="actions">
          <div className="actions-filter">
            <div className="product-count">
              <i>
                ({filteredProducts.length} {t("result")})
              </i>
            </div>
            <div className="filter">
              <div className="price-filter">
                <Slider
                  range
                  min={0}
                  max={1000}
                  defaultValue={[0, 1000]}
                  value={priceRange}
                  onChange={(value) => setPriceRange(value as [number, number])}
                />
                <div>
                  {t("price-range")} ${priceRange[0]} - ${priceRange[1]}
                </div>
              </div>
              <Select
                placeholder={t("select-category")}
                allowClear
                style={{ width: 200 }}
                onChange={handleCategoryChange}
                size="large"
              >
                {categories.map((category) => (
                  <Option key={category.name} value={category.name}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <div className="sort">
            <Select
              defaultValue={pageSize}
              style={{ width: 120 }}
              onChange={handlePageSizeChange}
              size="large"
            >
              <Option value={6}>6 / {t("page")}</Option>
              <Option value={8}>8 / {t("page")}</Option>
              <Option value={12}>12 /{t("page")}</Option>
            </Select>
            <div className="btn-viewType">
              <Tooltip title={t("gird")}>
                <Dropdown overlay={menu} trigger={["hover"]}>
                  <Button
                    icon={<AppstoreOutlined />}
                    onClick={() => handleViewTypeChange("card")}
                    style={{
                      backgroundColor: viewType === "card" ? "#ccc" : "",
                      marginRight: "5px",
                    }}
                    size="large"
                  ></Button>
                </Dropdown>
              </Tooltip>
              <Tooltip title={t("list-product")}>
                <Button
                  icon={<UnorderedListOutlined />}
                  onClick={() => handleViewTypeChange("list")}
                  style={{ backgroundColor: viewType === "list" ? "#ccc" : "" }}
                  size="large"
                ></Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="skeleton">
          <div className="skeleton-item">
            <Skeleton.Image active />
            <Skeleton active />
          </div>
          <div className="skeleton-item">
            <Skeleton.Image active />
            <Skeleton active />
          </div>
          <div className="skeleton-item">
            <Skeleton.Image active />
            <Skeleton active />
          </div>
          <div className="skeleton-item">
            <Skeleton.Image active />
            <Skeleton active />
          </div>
        </p>
      ) : filteredProducts.length === 0 ? (
        <Empty description="No data" style={{ marginTop: "20px" }} />
      ) : viewType === "list" ? (
        renderProductList(filteredProducts)
      ) : (
        renderProductCard(filteredProducts)
      )}
      <div className="pagination-buttons">
        <Tooltip title={t("prev-page")}>
          <Button onClick={handlePrevious} disabled={currentPage === 1}>
            <LeftOutlined />
          </Button>
        </Tooltip>
        <Tooltip title={t("next-page")}>
          <Button onClick={handleNext}>
            <RightOutlined />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Products;
