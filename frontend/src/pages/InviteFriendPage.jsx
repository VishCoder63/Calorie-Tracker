import { Button, Form, Input, Table } from "antd";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { userContext } from "../contexts/user.context";
import { inviteFriend } from "../services/user.service";
import styles from "../components/styles/inviteFriendPage.module.css";
import { useCookies } from "react-cookie";
import { openNotification } from "../utils/antNotification";

export const InviteFriendPage = () => {
  const [credentials, setCredentials] = useState([]);

  const onFinish = async (values) => {
    await inviteFriend({ email: values.email, name: values.name })
      .then((res) => {
        setCredentials([res.data.user]);
        openNotification(
          "Credentials generated successfully!Please save them for future login"
        );
      })
      .catch((err) => {
        openNotification(err.response?.data?.message);
      });
  };

  const columns = [
    {
      key: 1,
      title: "User_ID",
      dataIndex: "id",
    },
    {
      key: 2,
      title: "Name",
      dataIndex: "name",
    },
    {
      key: 3,
      title: "Email",
      dataIndex: "email",
    },
    {
      key: 4,
      title: "Password",
      dataIndex: "password",
    },
    {
      key: 5,
      title: "Role",
      dataIndex: "role",
    },
  ];

  return (
    <>
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
          <h1>Invite a friend!!</h1>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your friend's email!",
              },
            ]}
          >
            <Input placeholder="Please enter your friend's email here" />
          </Form.Item>

          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your friend's name!",
              },
            ]}
          >
            <Input placeholder="Please enter your friend's name here" />
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
              Send an Invite
            </Button>
          </Form.Item>
        </Form>
      </div>
      {credentials.length !== 0 && (
        <>
          <h2 style={{ textAlign: "center" }}>Generated credentials</h2>
          <Table
            columns={columns}
            dataSource={credentials}
            className={styles.tableStyle}
            pagination={false}
          ></Table>
        </>
      )}
    </>
  );
};
