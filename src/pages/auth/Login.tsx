import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.scss";
import { login, getUser, refresh } from "../../services/api";
import { ERROR, ROLE } from "../../utils/constants";
import { ADMIN, PRODUCTS, REGISTER, USER } from "../../routes";
import { useTranslation } from "react-i18next";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await login(data.email, data.password);
      const { accessToken, refreshToken } = response;
      console.log(accessToken);
      console.log(refreshToken);

      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("accessToken", accessToken);

      const userData = await getUser(accessToken);

      if (userData.role === ROLE.ADMIN) {
        message.success(t("SUCCESS.login", { name: "admin" }));
        navigate(`${ADMIN}/${PRODUCTS}`, { state: { token: accessToken } });
      } else if (userData.role === ROLE.USER) {
        message.success(t("SUCCESS.login", { name: userData.name }));
        navigate(`${USER}/${PRODUCTS}`, {
          state: { token: accessToken, user: userData },
        });
      } else {
        message.error(ERROR.AUTH);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        message.error(t("ERROR.login-invalid"));
      } else {
        message.error(t("ERROR.login"));
      }
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="background-image">
          <img src="../../public/login.jpg" alt="Left Image" />
        </div>
        <Form className="login-form" onFinish={handleSubmit(onSubmit)}>
          <h1>{t("login")}</h1>
          <Form.Item
            label="Email"
            validateStatus={errors.email ? "error" : ""}
            help={errors.email ? t("ERROR.login-email") : ""}
            className="form-item"
          >
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: t("ERROR.login-email"),
                },
              }}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item
            label={t("password")}
            validateStatus={errors.password ? "error" : ""}
            help={errors.password ? t("ERROR.is-required",{name: t('password')}) : ""}
            className="form-item"
          >
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => <Input.Password {...field} />}
            />
          </Form.Item>

          <Form.Item className="form-item">
            <Button type="primary" htmlType="submit" className="login-button">
              {t("login")}
            </Button>
          </Form.Item>
          <Form.Item className="form-item">
            <Button
              type="link"
              className="login-button"
              onClick={() => navigate(REGISTER)}
            >
              {t("do-not-account")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
