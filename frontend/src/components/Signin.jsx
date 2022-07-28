import { Button, Form, Input } from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { userContext } from "../contexts/user.context";
import { loginService } from "../services/user.service";
import styles from "./styles/signin.module.css";
import { useCookies } from "react-cookie";
import { openNotification } from "../utils/antNotification";
import { signInSchema } from "../schemas/user.schema";

const Signin = () => {
  const navigate = useNavigate();
  const { loggedInUser, setLoggedInUser } = useContext(userContext);
  const [cookies, setCookie, removeCookie] = useCookies(["token", "user"]);
  const onFinish = async (values) => {
    const { value, error } = signInSchema.validate({
      email: values.username,
      password: values.password,
    });
    if (error) openNotification(error.message);
    else {
      await loginService({ email: value.email, password: value.password })
        .then((res) => {
          const { token, ...user } = res.data;
          setLoggedInUser(user);
          setCookie("user", user);
          setCookie("token", token);
          openNotification("Logged in successfully!");
          navigate("/");
        })
        .catch((err) => {
          openNotification(err.response?.data?.message);
        });
    }
  };

  return (
    <div className={styles.mainClass}>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <h1>Signin</h1>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input placeholder="please enter username here" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password placeholder="please enter password here" />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 0,
            span: 20,
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            className={styles.submitButton}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export { Signin };
