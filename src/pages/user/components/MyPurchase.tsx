import React, { useEffect, useState } from "react";
import {
  List,
  message,
  Spin,
  Breadcrumb,
  Button,
  Rate,
  Modal,
  Input,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { getPurchaseOfUser, updateReviewPurchase } from "../../../services/api";
import { PRODUCTS, PURCHASE_DETAIL, USER } from "../../../routes";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;

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

const MyPurchase: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );
  const [reviewNote, setReviewNote] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const token = location.state?.token || null;
  const { t } = useTranslation();


  const fetchPurchases = async () => {
    try {
      const productId = null;
      const response = await getPurchaseOfUser(
        token,
        location.state?.user.id,
        productId,
        1
      );
      setPurchases(response);
    } catch (error) {
      message.error(t('ERROR.fetch-purchase'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [location]);

  if (loading) {
    return <Spin />;
  }

  const handlePurchaseClick = (purchaseId: string) => {
    navigate(`${USER}/${PURCHASE_DETAIL}/${purchaseId}`, {
      state: {
        token: location.state.token,
        purchaseId: purchaseId,
        user: location.state?.user,
      },
    });
  };

  const handleReviewClick = (purchase: Purchase, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedPurchase(purchase);
    setReviewNote(purchase.reviewNote ? parseInt(purchase.reviewNote) : 0);
    setReviewComment(purchase.reviewComment || "");
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    if (reviewNote === 0) {
      message.error(t('ERROR.please-review'));
      return;
    }
    if (selectedPurchase && token) {
      try {
        await updateReviewPurchase(
          selectedPurchase.id,
          token,
          reviewNote,
          reviewComment
        );
        message.success(t('SUCCESS.update-review'));
        fetchPurchases();
      } catch (error) {
        message.error(t('ERROR.update-review'));
        console.error(error);
      }
    }
    setModalVisible(false);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const desc = ["terrible", "bad", "normal", "good", "wonderful"];

  return (
    <div className="my-purchase">
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item
          onClick={() =>
            navigate(`${USER}/${PRODUCTS}`, {
              state: { token: location.state.token },
            })
          }
        >
          {t('home')}
        </Breadcrumb.Item>
        <Breadcrumb.Item>{t('purchase')}</Breadcrumb.Item>
      </Breadcrumb>
      <h1>{t('purchase')}</h1>
      <List
        itemLayout="horizontal"
        dataSource={purchases}
        renderItem={(purchase) => (
          <List.Item onClick={() => handlePurchaseClick(purchase.id)}>
            <List.Item.Meta
              title={
                <div style={{ color: "#444" }}>
                  <p>
                    Order ID: {purchase.id}
                    <i style={{ fontSize: "12px", marginLeft: "20px" }}>
                      {" "}
                      {new Date(purchase.createdAt).toLocaleString()}
                    </i>
                  </p>
                </div>
              }
              description={
                <div className="description">
                  <div className="description-purchase">
                    <p>
                      <strong>{purchase.product.name}</strong>
                    </p>
                    <p>
                      <strong>x {purchase.amount}</strong>
                    </p>
                    <p>
                      <strong>{t('total-price')}:</strong>
                      <strong style={{ color: "red" }}>
                        {" "}
                        ${purchase.totalPrice}
                      </strong>
                    </p>
                  </div>
                  <div className="description-review">
                    {purchase.reviewNote && (
                      <p>
                        <strong>{t('review-note')}:</strong>{" "}
                        <Rate
                          tooltips={desc}
                          value={
                            purchase.reviewNote
                              ? parseInt(purchase.reviewNote)
                              : 0
                          }
                          disabled
                        />
                      </p>
                    )}
                    {purchase.reviewComment && (
                      <p>
                        <strong>{t('review-comment')}:</strong>{" "}
                        {purchase.reviewComment}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={(event) => handleReviewClick(purchase, event)}
                    type="primary"
                  >
                    {t('review')}
                  </Button>
                </div>
              }
            />
          </List.Item>
        )}
      />
      <Modal
        title={t('review')}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <p>
          {t('product-quantity')}:{" "}
          <Rate tooltips={desc} onChange={setReviewNote} value={reviewNote} />
          {reviewNote ? <span>{desc[reviewNote - 1]}</span> : null}
        </p>
        <TextArea
          rows={4}
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
          placeholder={t('write-review')}
        />
      </Modal>
    </div>
  );
};

export default MyPurchase;
