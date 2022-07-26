import { Button, Form, Input, Table } from "antd";
import FormItem from "antd/lib/form/FormItem";
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userContext } from "../contexts/user.context";
import { FoodService } from "../services/foods.service";
import { openNotification } from "../utils/antNotification";
import moment from "moment";
import { useForm } from "antd/lib/form/Form";

export const FoodsList = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token", "user"]);
  const [editingRow, setEditingRow] = useState(null);
  const [form] = Form.useForm();
  const [foods, setFoods] = useState([]);

  const columns = [
    {
      key: 1,
      title: "Food_ID",
      dataIndex: "id",
    },
    {
      key: 2,
      title: "Name",
      dataIndex: "name",
      render: (text, record) => {
        if (record.id === editingRow) {
          return (
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please enter the food's name",
                },
              ]}
            >
              <Input />
            </Form.Item>
          );
        } else return <p>{text}</p>;
      },
    },
    {
      key: 3,
      title: "Created date",
      dataIndex: "datetime",
      render: (text, record) => {
        if (record.id === editingRow) {
          return (
            <Form.Item
              name="datetime"
              rules={[
                {
                  required: true,
                  message: "Please select the date",
                },
              ]}
            >
              <Input />
            </Form.Item>
          );
        } else return <p>{text}</p>;
      },
    },
    {
      key: 4,
      title: "Calorie",
      dataIndex: "calorie",
      render: (text, record) => {
        if (record.id === editingRow) {
          return (
            <Form.Item
              name="calorie"
              rules={[
                {
                  required: true,
                  message: "Please enter the calorie value",
                },
              ]}
            >
              <Input />
            </Form.Item>
          );
        } else return <p>{text}</p>;
      },
    },
    {
      key: 5,
      title: "Price",
      dataIndex: "price",
      render: (text, record) => {
        if (record.id === editingRow) {
          return (
            <Form.Item
              name="price"
              rules={[
                {
                  required: true,
                  message: "Please enter the price",
                },
              ]}
            >
              <Input />
            </Form.Item>
          );
        } else return <p>{text}</p>;
      },
    },
    {
      key: 6,
      title: "Created by",
      dataIndex: "createdBy",
    },
    {
      key: 8,
      title: "Actions",
      render: (_, record) => {
        return (
          <>
            {editingRow == null && (
              <Button
                onClick={() => {
                  setEditingRow(record.id);
                  // console.log("r", record);

                  form.setFieldsValue({
                    name: record.name,
                    datetime: record.datetime,
                    calorie: record.calorie,
                    price: record.price,
                  });
                }}
              >
                Edit
              </Button>
            )}

            {editingRow != null && <Button htmlType="submit">Save</Button>}

            <Button onClick={() => deleteFood(record)}>Delete</Button>
          </>
        );
      },
    },
  ];

  // const logged = GenUtil.getLoggedInUser();
  const navigate = useNavigate();

  const helper = (data) => {
    const newData = [];
    for (let i = 0; i < data?.length; i++) {
      const {
        id,
        name,
        date,
        time,
        calorie,
        price,
        dailyTotalCalorie,
        monthlyTotalAmount,
        user,
      } = data[i];
      // const color = bike.color;
      // const model = bike.model;
      // const name = user.name;
      const newObj = {
        id,
        name,
        datetime: moment(date + " " + time).format(),
        calorie,
        price,
        createdBy: user.name,
        dailyTotalCalorie,
        monthlyTotalAmount,
        user,
      };
      newData.push(newObj);
    }
    return newData;
  };

  useEffect(() => {
    getFoods();
  }, []);
  const getFoods = async () => {
    try {
      const data = await FoodService.getFoods(cookies.token);
      if (data.data) {
        const tableSettableData = helper(data.data);
        setFoods(tableSettableData);
      } else {
        throw new Error({
          response: { data: { message: "Error while fetching food entries!" } },
        });
      }
    } catch (e) {
      openNotification(e.message);
    }
  };
  // const RateBike = (record) => {
  //   const id = record.id;
  //   navigate(`/reservation/rating/${id}`);
  // };
  const deleteFood = async (record) => {
    try {
      await FoodService.deleteFood(record.id, cookies.token);
      openNotification("Deleted successfully!!");
      getFoods();
    } catch (e) {
      openNotification(e.response.data.message);
    }
  };
  const updateFood = async (id, values) => {
    try {
      await FoodService.updateFood(id, values, cookies.token);
      openNotification("Updated successfully!!");
      getFoods();
    } catch (e) {
      openNotification(e.response.data.message);
    }
  };
  const handleOnFinish = async (values) => {
    console.log(values, editingRow);
    console.log("updated");
    await updateFood(editingRow, values);
    setEditingRow(null);
  };
  return (
    <>
      <Form form={form} onFinish={handleOnFinish}>
        <Table columns={columns} dataSource={foods}></Table>
      </Form>
    </>
  );
};
