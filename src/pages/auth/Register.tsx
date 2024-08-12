import React from "react";
import { Form, Input, Button, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.scss";
import { register } from "../../services/api";
import { LOGIN } from "../../routes";
import { useTranslation } from "react-i18next";

interface LoginFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  address: string;
}

const Register: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onSubmit = async (data: LoginFormInputs) => {
    console.log(data);

    try {
      const response = await register(data);
      message.success(t('SUCCESS.register'));
      navigate(LOGIN);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  const password = watch("password");

  return (
    <div className="login">
      <div className="login-container">
        <div className="background-image">
          <img src="../../public/register.jpg" alt="Left Image" />
        </div>
        <Form className="login-form" onFinish={handleSubmit(onSubmit)}>
          <h1>{t('register')}</h1>
          <Form.Item
            label="Email"
            validateStatus={errors.email ? "error" : ""}
            help={errors.email ? t('ERROR.login-email') : ""}
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
                  message: t('ERROR.login-email'),
                },
              }}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item
            label={t("password")}
            validateStatus={errors.password ? "error" : ""}
            help={errors.password ? t("ERROR.is-required",{name: t('password')}): ""}
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

          <Form.Item
            label={t("confirm-password")}
            validateStatus={errors.confirmPassword ? "error" : ""}
            help={errors.confirmPassword ? t('ERROR.password-not-match') : ""}
            className="form-item"
          >
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                validate: (value) =>
                  value === password || t('ERROR.password-not-match'),
              }}
              render={({ field }) => <Input.Password {...field} />}
            />
          </Form.Item>

          <Form.Item
            label={t('full-name')}
            validateStatus={errors.name ? "error" : ""}
            help={errors.name ? t("ERROR.is-required",{name: t('full-name')}) : ""}
            className="form-item"
          >
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item
            label={t('address')}
            validateStatus={errors.address ? "error" : ""}
            help={errors.address ? t("ERROR.is-required",{name: t('address')}) : ""}
            className="form-item"
          >
            <Controller
              name="address"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item className="form-item">
            <Button type="primary" htmlType="submit" className="login-button">
             {t('register')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
