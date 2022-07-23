import { Button, Form, Input } from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userContext } from "../contexts/user.context";
import styles from "./styles/signin.module.css";

const Signin = () => {
  const navigate = useNavigate();
  const { onLogin } = useContext(userContext);

  const onFinish = async (values) => {
    
    onLogin({ email: values.username, password: values.password })
      .then((res) => {
        toast.success("Logged in successfully!");
      })
      .catch((err) => {
        toast.error("Invalid credentials");
      });
    // console.log("Success:", values);
  };

  const onFinishFailed = ({ errorFields }) => {
    // toast("hi there");
    // errorFields.map((err) =>
    //   toast.error(err.errors[0], {
    //     position: "top-right",
    //     autoClose: 3000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //   })
    // );
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
          <Button type="primary" onClick={() => navigate("/signup")}>
            New user? Signup
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export { Signin };
