import React, { useEffect, useState, useMemo } from "react";
import { Table, Button, Modal, message, Spin, Rate, Input, Form } from "antd";
import { ExclamationCircleOutlined, LeftOutlined, RightOutlined, DeleteFilled, EditFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getUser, getPurchaseOfAdmin, deletePurchase, updatePurchase } from "../../../services/api";
import { ROLE, ERROR } from "../../../utils/constants";
import { LOGIN } from "../../../routes";
import "../../../styles/Admin.scss";
import { useDebounce } from "../../../hooks/useDebounce";

const { confirm } = Modal;
const { Search } = Input;

interface Purchase {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  totalPrice: string;
  reviewNote: string | null;
  reviewComment: string | null;
  createdAt: string;
  user: {
    email: string;
  };
  product: {
    name: string;
  };
}

const PurchaseList: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null); 
  const [modalVisible, setModalVisible] = useState(false); 
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [searchText, setSearchText] = useState("");

  const debouncedSearchText = useDebounce(searchText, 1000);

  useEffect(() => {
    if (!token) {
      handleUnauthorized();
    } else {
      handleGetUser();
    }
  }, [navigate, currentPage, token]);

  useEffect(() => {
    if (isAdmin) {
      fetchPurchases(currentPage);
    }
  }, [isAdmin, currentPage]);

  const handleUnauthorized = () => {
    message.error(ERROR.AUTH);
    navigate(LOGIN);
  };

  const handleGetUser = () => {
    getUser(token)
      .then((response) => {
        if (response.role === ROLE.ADMIN) {
          setIsAdmin(true);
        } else {
          handleUnauthorized();
        }
      })
      .catch(() => {
        handleUnauthorized();
      });
  };

  const fetchPurchases = (page: number): void => {
    setLoading(true);
    getPurchaseOfAdmin(token, null, null, page)
      .then((response) => {
        setPurchases(response);
        setLoading(false);
      })
      .catch((error) => {
        message.error("Failed to fetch purchases");
        setLoading(false);
      });
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Are you sure delete this purchase?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        if (token) {
          deletePurchase(id, token)
            .then(() => {
              message.success("Purchase deleted successfully");
              fetchPurchases(currentPage);
            })
            .catch(() => {
              message.error("Failed to delete product");
            });
        }
      },
    });
  };

  const handleEdit = (record: Purchase) => {
    setEditingPurchase(record);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingPurchase(null);
  };

  const handleModalSave = async () => {
    if (!editingPurchase) return;
    try {
      await updatePurchase(editingPurchase.id, token, editingPurchase.productId, editingPurchase.amount);
      message.success("Purchase updated successfully");
      fetchPurchases(currentPage);
      setModalVisible(false);
      setEditingPurchase(null);
    } catch (error) {
      message.error("Failed to update purchase");
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const filteredPurchases = useMemo(() => {
    if (!debouncedSearchText) return purchases;
    const lowerSearchText = debouncedSearchText.toLowerCase();
    return purchases.filter((purchase: Purchase) =>
      purchase.user.email.toLowerCase().includes(lowerSearchText) ||
      purchase.product.name.toLowerCase().includes(lowerSearchText)
    );
  }, [purchases, debouncedSearchText]);

  const columns = [
    {
      title: "Product Name",
      dataIndex: ["product", "name"],
      key: "productName",
      sorter: (a: Purchase, b: Purchase) => a.product.name.localeCompare(b.product.name),
    },
    {
      title: "Email Address",
      dataIndex: ["user", "email"],
      key: "userEmail",
      sorter: (a: Purchase, b: Purchase) => a.user.email.localeCompare(b.user.email),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a: Purchase, b: Purchase) => a.amount - b.amount,
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      sorter: (a: Purchase, b: Purchase) => parseFloat(a.totalPrice) - parseFloat(b.totalPrice),
    },
    {
      title: "Ordered At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => new Date(text).toLocaleString(),
      sorter: (a: Purchase, b: Purchase) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Review Note",
      dataIndex: "reviewNote",
      key: "reviewNote",
      render: (note: string | null) => (
        note && <Rate value={note ? parseInt(note) : 0} disabled />
      ),
      sorter: (a: Purchase, b: Purchase) => {
        const noteA = a.reviewNote ? parseInt(a.reviewNote) : 0;
        const noteB = b.reviewNote ? parseInt(b.reviewNote) : 0;
        return noteA - noteB;
      },
    },
    {
      title: "Review Comment",
      dataIndex: "reviewComment",
      key: "reviewComment",
      width: '230px',
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: Purchase) => (
        <div>
          <Button type="link" onClick={() => handleEdit(record)}>
            <EditFilled />
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            <DeleteFilled />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="purchase-list">
      <div className="header-container">
        <h1>Purchase List</h1>
        <Search
          placeholder="Search by email or product name..."
          onChange={handleSearchChange}
          className="ant-input-search"
          size="large"
        />
      </div>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredPurchases}
          rowKey="id"
          pagination={false}
        />
      </Spin>

      <Modal
        title="Edit Purchase"
        visible={modalVisible}
        onOk={handleModalSave}
        onCancel={handleModalCancel}
        okText="Save"
        cancelText="Cancel"
      >
        <Form layout="vertical">
          <Form.Item label="Product Name">
            <Input value={editingPurchase?.product.name} disabled />
          </Form.Item>
          <Form.Item label="User Email">
            <Input value={editingPurchase?.user.email} disabled />
          </Form.Item>
          <Form.Item label="Amount">
            <Input
              type="number"
              value={editingPurchase?.amount}
              onChange={(e) =>
                setEditingPurchase({
                  ...editingPurchase!,
                  amount: parseInt(e.target.value),
                })
              }
            />
          </Form.Item>
        </Form>
      </Modal>

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

export default PurchaseList;
