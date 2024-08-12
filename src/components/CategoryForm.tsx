import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import {
  createCategory,
  getCategoryById,
  updateCategory,
} from "../services/api";
import "../styles/Admin.scss";
import { ERROR, MODE } from "../utils/constants";
import { ADMIN, CATEGORIES, LOGIN } from "../routes";

interface Category {
  id: string;
  name: string;
}

interface Props {
  mode: string;
}

const CategoryForm: React.FC<Props> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token || null;

  const fetchCategory = (id: string, token: string) => {
    getCategoryById(id, token)
      .then((response) => {
        setCategory(response);
      })
      .catch(() => {
        message.error("Failed to fetch category");
      });
  };

  const handleCreateCategory = (values: any, token: string) => {
    createCategory(values, token)
      .then(() => {
        message.success("Category added successfully");
        navigate(`${ADMIN}/${CATEGORIES}`, { state: { token } });
      })
      .catch((error) => {
        message.error("Failed to add category");
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdateCategory = (id: string, values: any, token: string) => {
    updateCategory(id, values, token)
      .then(() => {
        message.success("Category updated successfully");
        navigate(`${ADMIN}/${CATEGORIES}`, { state: { token } });
      })
      .catch((error) => {
        message.error("Failed to update category");
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (token === null) {
      handleUnauthorized();
    }

    if (mode === MODE.EDIT && id) {
      fetchCategory(id, token);
    }
  }, [id, mode, navigate, token]);

  const handleUnauthorized = () => {
    message.error(ERROR.AUTH);
    navigate(LOGIN);
  };

  const handleFormSubmit = (values: any) => {
    setLoading(true);

    if (mode === MODE.ADD) {
      handleCreateCategory(values, token);
    } else if (mode === MODE.EDIT && id) {
      handleUpdateCategory(id, values, token);
    }
  };

  if (mode === MODE.EDIT && !category) {
    return <div>Loading...</div>;
  }

  return (
    <div className="add-category">
      <h1>{mode === MODE.ADD ? "Add Category" : "Edit Category"}</h1>
      <Form
        initialValues={category}
        onFinish={handleFormSubmit}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Category Name"
          rules={[
            { required: true, message: "Please input the category name!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {mode === MODE.ADD ? "Add Category" : "Update Category"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CategoryForm;
