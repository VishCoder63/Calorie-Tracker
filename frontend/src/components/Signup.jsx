import { Button, Form, Input, Select } from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userContext } from "../contexts/user.context";
import styles from "./styles/signin.module.css";

const Signup = () => {
  const navigate = useNavigate();
  const { onSignup } = useContext(userContext);

  const onFinish = (values) => {
    onSignup({
      name: values.username,
      email: values.email,
      password: values.password,
    })
      .then((res) => {
        toast.success("Registered successfully!");
      })
      .catch((err) => {
        toast.error("Invalid credentials");
      });
  };

  const onFinishFailed = ({ errorFields }) => {
    console.log("Failed:", errorFields);
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
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <h1>Signup Form</h1>
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
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
            {
              type: "email",
              message: "Email is not valid!",
            },
          ]}
        >
          <Input type="email" placeholder="please enter email here" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
            {
              min: 4,
              message: "Length should be greater than 4",
            },
          ]}
        >
          <Input.Password placeholder="please enter password here" />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 2,
            span: 20,
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            className={styles.submitButton}
          >
            Signup
          </Button>
          <Button type="primary" onClick={() => navigate("/")}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export { Signup };
