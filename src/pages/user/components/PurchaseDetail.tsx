import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Spin, message, Breadcrumb, Rate } from "antd";
import { getPurchaseById } from "../../../services/api";
import { HOME, MYPURCHASE, USER } from "../../../routes";
import "../../../styles/User.scss";
import { useUser } from "../../../contexts/UserContext";
import { useTranslation } from "react-i18next";

interface PurchaseDetailProps {
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

const PurchaseDetail: React.FC = () => {
  const [purchase, setPurchase] = useState<PurchaseDetailProps | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token || null;
  const { user } = useUser();
  const { t } = useTranslation();


  useEffect(() => {
    if (location.state && location.state.token && location.state.purchaseId) {
      fetchPurchaseDetail(location.state.purchaseId);
    }
  }, [location.state.purchaseId, token]);

  const fetchPurchaseDetail = (purchaseId: string) => {
    setLoading(true);
    getPurchaseById(purchaseId, token)
      .then((response) => {
        setPurchase(response);
        setLoading(false);
      })
      .catch(() => {
        message.error(t('ERROR.fetch-purchase-details'));
        setLoading(false);
      });
  };

  if (loading) {
    return <Spin spinning={loading} />;
  }

  if (!purchase) {
    return <div>No Purchase Detail Found</div>;
  }

  return (
    <div className="purchase-detail">
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => navigate(HOME, { state: { token } })}>
          {t('home')}
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate(`${USER}/${MYPURCHASE}`, { state: { token: token, user: user } })}>
        {t('purchase')}
        </Breadcrumb.Item>
        <Breadcrumb.Item>{t('purchase-details')}</Breadcrumb.Item>
      </Breadcrumb>
      <div className="card-detail">
        <Card title={t('purchase-details')}>
          <p><strong>{purchase.product.name}</strong></p>
          <p><strong>{t('amount')}:</strong> {purchase.amount}</p>
          <p><strong>{t('total-price')}:</strong> <strong style={{color:'red'}}>${purchase.totalPrice}</strong></p>
          <p><strong>{t('review-note')}:</strong> <Rate value={purchase.reviewNote ? parseInt(purchase.reviewNote) : 0} disabled /></p>
          <p><strong>{t('review-comment')}:</strong> {purchase.reviewComment || "N/A"}</p>
          <p><strong>{t('email')}:</strong> {purchase.user.email}</p>
          <p><strong>{t('ordered-at')}:</strong> {new Date(purchase.createdAt).toLocaleString()}</p>
        </Card>
        
      </div>
    </div>
  );
};

export default PurchaseDetail;
