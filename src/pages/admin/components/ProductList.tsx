import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  message,
  Skeleton,
  Image,
  Select,
} from "antd";
import {
  ExclamationCircleOutlined,
  EditFilled,
  DeleteFilled,
  LeftOutlined,
  RightOutlined,
  PlusOutlined,
  ImportOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getUser,
  getAllProduct,
  deleteProduct,
  updateProductPicture,
  createProduct,
  getCategoryByName,
} from "../../../services/api";
import { useDebounce } from "../../../hooks/useDebounce";
import "../../../styles/Admin.scss";
import { ERROR, MODE, ROLE } from "../../../utils/constants";
import { ADMIN, LOGIN, PRODUCT_FORM } from "../../../routes";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { Option } from "antd/es/mentions";

const { Search } = Input;
const { confirm } = Modal;

interface Product {
  id: string;
  name: string;
  picture: string;
  basePrice: number;
  stock: number;
  discountPercentage: number;
  description: string;
  categories: { name: string }[];
}

const ProductList: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [newPicture, setNewPicture] = useState<File | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const debouncedSearchText = useDebounce(searchText, 1000);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importedProducts, setImportedProducts] = useState([]);
  const allColumns = [
    "name",
    "picture",
    "basePrice",
    "id",
    "stock",
    "discountPercentage",
    "description",
    "categories",
    "actions",
  ];
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    ...allColumns,
  ]);

  useEffect(() => {
    if (!token) {
      handleUnauthorized();
    } else {
      handleGetUser();
    }
  }, [navigate, currentPage, debouncedSearchText, token]);

  const handleUnauthorized = () => {
    message.error(ERROR.AUTH);
    navigate(LOGIN);
  };

  const handleGetUser = () => {
    getUser(token)
      .then((response) => {
        if (response.role === ROLE.ADMIN) {
          setIsAdmin(true);
          fetchProducts(debouncedSearchText, currentPage);
        } else {
          handleUnauthorized();
        }
      })
      .catch(() => {
        handleUnauthorized();
      });
  };

  const fetchProducts = (productName: string, page: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      getAllProduct(productName, page)
        .then((response) => {
          const storedProducts = JSON.parse(
            localStorage.getItem("importedProducts") || "[]"
          );
          setProducts([...storedProducts, ...response]);
          setTotal(response.total);
          setLoading(false);
          resolve();
        })
        .catch((error) => {
          message.error("Failed to fetch products");
          setLoading(false);
          reject(error);
        });
    });
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Are you sure delete this product?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        if (token) {
          deleteProduct(id, token)
            .then(() => {
              message.success("Product deleted successfully");
              fetchProducts(debouncedSearchText, currentPage);
            })
            .catch(() => {
              message.error("Failed to delete product");
            });
        }
      },
    });
  };

  const handleEdit = (id: string) => {
    navigate(`${ADMIN}/${PRODUCT_FORM}/${id}`, {
      state: { token: token, mode: MODE.EDIT },
    });
  };

  const handleAddProduct = () => {
    navigate(`${ADMIN}/${PRODUCT_FORM}`, {
      state: { token: token, mode: MODE.ADD },
    });
  };

  const handlePictureChange = (id: string) => {
    setSelectedProductId(id);
    setModalVisible(true);
  };

  const handleModalOk = () => {
    if (newPicture && selectedProductId && token) {
      if (beforeUpload(newPicture)) {
        const formData = new FormData();
        formData.append("file", newPicture);

        updateProductPicture(selectedProductId, formData, token)
          .then(() => {
            message.success("Picture updated successfully");
            setModalVisible(false);
            setNewPicture(null);
            fetchProducts(debouncedSearchText, currentPage);
          })
          .catch(() => {
            message.error("Failed to update picture");
          });
      } else {
        message.error(
          "Invalid file. Please upload a JPG/PNG/JPEG file smaller than 3MB."
        );
      }
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setNewPicture(null);
  };

  useEffect(() => {
    setSearchLoading(true);
    fetchProducts(debouncedSearchText, 1).finally(() => {
      setSearchLoading(false);
    });
  }, [debouncedSearchText]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log(files);
    if (files && files.length > 0) {
      setNewPicture(files[0]);
    }
  };

  const fetchCategoryIds = async (
    categoryNames: string[]
  ): Promise<string[]> => {
    const categoryIds: string[] = [];

    for (const name of categoryNames) {
      try {
        const category = await getCategoryByName(name.trim());
        if (category && category.id) {
          categoryIds.push(category.id);
        }
      } catch (error) {
        console.error(`Failed to fetch category ID for ${name}:`, error);
      }
    }

    return categoryIds;
  };

  const handleAdd = async (product: Product) => {
    try {
      const categoryIds = await fetchCategoryIds(
        product.categories.map((cat) => cat.name)
      );
      const newProductData = {
        name: product.name,
        basePrice: product.basePrice,
        discountPercentage: product.discountPercentage,
        stock: product.stock,
        description: product.description,
        categories: categoryIds,
      };

      await createProduct(newProductData, token);

      message.success("Product added successfully!");
      fetchProducts(debouncedSearchText, currentPage);

      const storedProducts = JSON.parse(
        localStorage.getItem("importedProducts") || "[]"
      );
      const updatedProducts = storedProducts.filter(
        (p: Product) => p.name !== product.name
      );
      localStorage.setItem("importedProducts", JSON.stringify(updatedProducts));
    } catch (error) {
      message.error("Failed to add product!");
      console.error(error);
    }
  };

  const handleDeleteImport = (name: string) => {
    const storedProducts = JSON.parse(
      localStorage.getItem("importedProducts") || "[]"
    );
    const updatedProducts = storedProducts.filter(
      (p: Product) => p.name !== name
    );
    localStorage.setItem("importedProducts", JSON.stringify(updatedProducts));
    fetchProducts(debouncedSearchText, currentPage);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
    },
    {
      title: "Picture",
      dataIndex: "picture",
      key: "picture",
      render: (text: string, record: Product) => (
        <div className="picture-container">
          {text ? (
            <img
              src={text ? `http://${text}` : ""}
              alt={record.name}
              className="product-picture"
            />
          ) : (
            <Image
              width={100}
              height={100}
              style={{ borderRadius: "8px" }}
              src="error"
              fallback="data:image/png;base64,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"
            />
          )}

          <Button
            className="change-button"
            onClick={() => handlePictureChange(record.id)}
          >
            Change
          </Button>
        </div>
      ),
    },
    {
      title: "Price Base",
      dataIndex: "basePrice",
      key: "basePrice",
      sorter: (a: Product, b: Product) => a.basePrice - b.basePrice,
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      sorter: (a: Product, b: Product) => a.stock - b.stock,
    },
    {
      title: "Discount Percentage",
      dataIndex: "discountPercentage",
      key: "discountPercentage",
      sorter: (a: Product, b: Product) =>
        a.discountPercentage - b.discountPercentage,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <div className="description-container">{text}</div>
      ),
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      render: (categories: { name: string }[]) => (
        <div className="categories-container">
          {categories
            ? categories.map((cat) => <div key={cat.name}>{cat.name}</div>)
            : "N/A"}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: Product) =>
        record.isNew === true ? (
          <div>
            <Button type="link" onClick={() => handleAdd(record)}>
              <PlusOutlined />
            </Button>
            <Button
              type="link"
              danger
              onClick={() => handleDeleteImport(record.name)}
            >
              <DeleteFilled />
            </Button>
          </div>
        ) : (
          <div>
            <Button type="link" onClick={() => handleEdit(record.id)}>
              <EditFilled />
            </Button>
            <Button type="link" danger onClick={() => handleDelete(record.id)}>
              <DeleteFilled />
            </Button>
          </div>
        ),
    },
  ];

  const beforeUpload = (file: File) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG/JPEG file!");
    }
    const isLt3M = file.size / 1024 / 1024 < 3;
    if (!isLt3M) {
      message.error("Image must be smaller than 3MB!");
    }
    return isJpgOrPng && isLt3M;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchProducts(debouncedSearchText, newPage);
    }
  };

  const handleNext = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    fetchProducts(debouncedSearchText, newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const displayedColumns = columns.filter((column) =>
    selectedColumns.includes(column.key)
  );

  const handleExportCSV = () => {
    const dataToExport = products.map((product) => ({
      id: product.id,
      name: product.name,
      picture: product.picture,
      basePrice: product.basePrice,
      stock: product.stock,
      discountPercentage: product.discountPercentage,
      description: product.description,
      categories: product.categories?.map((cat) => cat.name).join(", "),
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "products.csv");
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const importedData: Product[] = result.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            picture: item.picture,
            basePrice: parseFloat(item.basePrice),
            stock: parseInt(item.stock, 10),
            discountPercentage: parseFloat(item.discountPercentage),
            description: item.description,
            categories: item.categories
              ? item.categories.split(",").map((name: string) => ({ name }))
              : [],
            isNew: true,
          }));

          let allValid = true;
          importedData.forEach((product, index) => {
            const errors = [];
            if (!product.name) errors.push("Name is missing");
            if (isNaN(product.basePrice)) errors.push("Base Price is invalid");
            if (!Number.isInteger(product.stock))
              errors.push("Stock is invalid");
            if (isNaN(product.discountPercentage))
              errors.push("Discount Percentage is invalid");

            if (errors.length > 0) {
              allValid = false;
              message.error(`Row ${index + 1}: ${errors.join(", ")}`);
            }
          });

          if (!allValid) {
            return;
          }
          setImportedProducts(importedData);

          localStorage.setItem(
            "importedProducts",
            JSON.stringify(importedData)
          );
        },
      });
    }
  };

  const handleColumnChange = (value: string[]) => {
    if (value.includes("all")) {
      setSelectedColumns([...allColumns]);
    } else {
      setSelectedColumns(value);
    }
  };

  return (
    <div className="product-list">
      <div className="header-container">
        <h1>Product List</h1>
        <Search
          placeholder="Search products"
          onChange={handleSearchChange}
          className="ant-input-search"
          size="large"
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddProduct}
          size="large"
        >
          Add Product
        </Button>
      </div>
      {searchLoading ? (
        <Skeleton active />
      ) : (
        <>
          <div className="feature">
            <div className="checkbox">
              <Select
                mode="multiple"
                className="column-select"
                value={
                  selectedColumns.includes("all") ? ["all"] : selectedColumns
                }
                onChange={handleColumnChange}
                style={{ minWidth: 200 }}
              >
                <Option key="all" value="all">
                  All
                </Option>
                {columns.map((column) => (
                  <Option key={column.key} value={column.key}>
                    {column.title}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="btn">
              <Button
                icon={<ImportOutlined />}
                onClick={() => setImportModalVisible(true)}
              >
                Import
              </Button>
              <Button icon={<ExportOutlined />} onClick={handleExportCSV}>
                Export
              </Button>
            </div>
          </div>
          <Table
            columns={displayedColumns}
            dataSource={products}
            rowKey="id"
            loading={loading}
            pagination={false}
            className="ant-table"
          />
        </>
      )}
      <div className="pagination-buttons">
        <Button onClick={handlePrevious} disabled={currentPage === 1}>
          <LeftOutlined />
        </Button>
        <Button onClick={handleNext}>
          <RightOutlined />
        </Button>
      </div>
      <Modal
        open={modalVisible}
        title="Change Product Picture"
        onCancel={handleModalCancel}
        onOk={handleModalOk}
      >
        <input
          type="file"
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png"
        />
      </Modal>
      <Modal
        visible={importModalVisible}
        title="Import Products from CSV"
        onOk={() => {
          setProducts([...importedProducts, ...products]);
          setImportModalVisible(false);
        }}
        onCancel={() => setImportModalVisible(false)}
      >
        <input type="file" accept=".csv" onChange={handleImportCSV} />
      </Modal>
    </div>
  );
};

export default ProductList;
