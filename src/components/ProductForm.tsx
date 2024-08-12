import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, Form, Input, InputNumber, message, Select } from "antd";
import {
  createProduct,
  getProductById,
  updateProduct,
  getAllCategory,
} from "../services/api";
import "../styles/Admin.scss";
import { ERROR, MODE } from "../utils/constants";
import { ADMIN, LOGIN, PRODUCTS } from "../routes";

const { TextArea } = Input;
const { Option } = Select;

interface Product {
  id: string;
  name: string;
  basePrice: number;
  stock: number;
  discountPercentage: number;
  description: string;
  categories: string[];
}

interface Category {
  id: string;
  name: string;
}

interface Props {
  mode: string;
}

const ProductForm: React.FC<Props> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token || null;

  const fetchCategories = () => {
    getAllCategory("", 1, 100)
      .then((response) => {
        setCategories(response);
      })
      .catch(() => {
        message.error("Failed to fetch categories");
      });
  };

  const fetchProduct = (id: string, token: string) => {
    getProductById(id, token)
      .then((response) => {
        setProduct({
          ...response,
          basePrice: parseFloat(response.basePrice),
          categories: response.categories.map(
            (cat: { name: string }) => cat.name
          ),
        });
      })
      .catch(() => {
        message.error("Failed to fetch product");
      });
  };

  useEffect(() => {
    if (token === null) {
      handleUnauthorized();
    }

    fetchCategories();

    if (mode === MODE.EDIT && id) {
      fetchProduct(id, token);
    }
  }, [id, mode, navigate, token]);

  const handleUnauthorized = () => {
    message.error(ERROR.AUTH);
    navigate(LOGIN);
  };

  const handleSubmit = (values: any) => {
    setLoading(true);

    if (token) {
      const formattedValues = {
        ...values,
        categories:
          mode === "add"
            ? values.categories.map(
                (cat: string) =>
                  categories.find((category) => category.name === cat)?.id ||
                  cat
              )
            : undefined,
      };

      if (mode === MODE.ADD) {
        createProduct(formattedValues, token)
          .then(() => {
            message.success("Product added successfully");
            navigate(`${ADMIN}/${PRODUCTS}`, { state: { token: token } });
          })
          .catch((error) => {
            message.error("Failed to add product");
            console.error(error);
          })
          .finally(() => {
            setLoading(false);
          });
      } else if (mode === MODE.EDIT && id) {
        updateProduct(id, formattedValues, token)
          .then(() => {
            message.success("Product updated successfully");
            navigate(`${ADMIN}/${PRODUCTS}`, { state: { token: token } });
          })
          .catch((error) => {
            message.error("Failed to update product");
            console.error(error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };

  if (mode === MODE.EDIT && !product) {
    return <div>Loading...</div>;
  }

  return (
    <div className={mode === MODE.ADD ? "add-product" : "edit-product"}>
      <h1>{mode === MODE.ADD ? "Add Product" : "Edit Product"}</h1>
      <Form
        initialValues={product || {}}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: "Please input the product name!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="basePrice"
          label="Base Price"
          rules={[
            { required: true, message: "Please input the base price!" },
            {
              type: "number",
              min: 0,
              message: "Base price must be greater than or equal to 0!",
            },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item
          name="stock"
          label="Stock"
          rules={[
            { required: true, message: "Please input the stock!" },
            {
              type: "number",
              min: 0,
              message: "Stock must be greater than or equal to 0!",
            },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item
          name="discountPercentage"
          label="Discount Percentage"
          rules={[
            {
              required: true,
              message: "Please input the discount percentage!",
            },
            {
              type: "number",
              min: 0,
              max: 100,
              message: "Discount percentage must be between 0 and 100!",
            },
          ]}
        >
          <InputNumber min={0} max={100} />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please input the description!" }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        {mode === MODE.ADD && (
          <Form.Item
            name="categories"
            label="Categories"
            rules={[
              {
                required: true,
                message: "Please select at least one category!",
              },
            ]}
          >
            <Select mode="multiple" allowClear placeholder="Select categories">
              {categories.map((category) => (
                <Option key={category.id} value={category.name}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {mode === "add" ? "Add Product" : "Update Product"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductForm;
