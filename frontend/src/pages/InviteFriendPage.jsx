import { Alert, Button, Form, Input, Table } from "antd";
import React, { useState } from "react";

import { inviteFriend } from "../services/user.service";
import styles from "../components/styles/inviteFriendPage.module.css";

import { openNotification } from "../utils/antNotification";
import { inviteFriendSchema } from "../schemas/user.schema";

export const InviteFriendPage = () => {
  const [credentials, setCredentials] = useState({});

  const onFinish = async (values) => {
    const { value, error } = inviteFriendSchema.validate({
      email: values.email,
      name: values.name,
    });
    if (error) openNotification(error.message);
    else {
      await inviteFriend({ email: value.email, name: value.name })
        .then((res) => {
          setCredentials(res.data.user);
          openNotification(
            "Credentials generated successfully!Please save them for future login"
          );
        })
        .catch((err) => {
          openNotification(err.response?.data?.message);
        });
    }
  };

  return (
    <>
      <div className={styles.mainClass}>
        <Form
          style={{ paddingLeft: "5rem" }}
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
        <div>
          {credentials.name && (
            <>
              <Alert
                style={{ textAlign: "center" }}
                type="success"
                message={`
              Successfully invited ${credentials.name}!!`}
              />
              <Alert
                style={{ textAlign: "center" }}
                type="success"
                message={`Email: ${credentials.email} Password: ${credentials.password}`}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};
