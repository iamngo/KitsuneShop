import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, message, Spin } from "antd";
import {
  ExclamationCircleOutlined,
  EditFilled,
  DeleteFilled,
  LeftOutlined,
  RightOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { getUser, getAllCategory, deleteCategory } from "../../../services/api";
import { useDebounce } from "../../../hooks/useDebounce";
import "../../../styles/Admin.scss";
import { ERROR, MODE, ROLE } from "../../../utils/constants";
import { ADMIN, CATEGORY_FORM, LOGIN } from "../../../routes";

const { Search } = Input;
const { confirm } = Modal;

interface Category {
  id: string;
  name: string;
}

const CategoryList: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("accessToken");

  const debouncedSearchText = useDebounce(searchText, 1000);

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
          fetchCategories(debouncedSearchText, currentPage);
        } else {
          handleUnauthorized();
        }
      })
      .catch(() => {
        handleUnauthorized();
      });
  };

  const fetchCategories = (
    categoryName: string,
    page: number
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      getAllCategory(categoryName, page)
        .then((response) => {
          setCategories(response);
          setTotal(response.total);
          setLoading(false);
          resolve();
        })
        .catch((error) => {
          message.error("Failed to fetch categories");
          setLoading(false);
          reject(error);
        });
    });
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Are you sure delete this category?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        if (token) {
          deleteCategory(id, token)
            .then(() => {
              message.success("Category deleted successfully");
              fetchCategories(debouncedSearchText, currentPage);
            })
            .catch(() => {
              message.error("Failed to delete category");
            });
        }
      },
    });
  };

  const handleEdit = (id: string) => {
    navigate(`${ADMIN}/${CATEGORY_FORM}/${id}`, {
      state: { token: token, mode: MODE.EDIT },
    });
  };

  const handleAddCategory = () => {
    navigate(`${ADMIN}/${CATEGORY_FORM}`, {
      state: { token: token, mode: MODE.ADD },
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Category, b: Category) => a.name.localeCompare(b.name),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: Category) => (
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

  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchCategories(debouncedSearchText, newPage);
    }
  };

  const handleNext = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    fetchCategories(debouncedSearchText, newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  return (
    <div className="category-list">
      <div className="header-container">
        <h1>Category List</h1>
        <Search
          placeholder="Search categories"
          onChange={handleSearchChange}
          className="ant-input-search"
          size="large"
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddCategory}
          size="large"
        >
          Add Category
        </Button>
      </div>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          pagination={false}
        />
      </Spin>
      <div className="pagination-buttons">
        <Button onClick={handlePrevious} disabled={currentPage === 1}>
          <LeftOutlined />
        </Button>
        <Button onClick={handleNext}>
          <RightOutlined />
        </Button>
      </div>
    </div>
  );
};

export default CategoryList;
