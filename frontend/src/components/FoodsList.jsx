import { Button, DatePicker, Form, Input, Popover, Table } from "antd";

import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { userContext } from "../contexts/user.context";
import { FoodService } from "../services/foods.service";
import { openNotification } from "../utils/antNotification";
import moment from "moment";
import { Role } from "../enums/roles.enum.ts";
import { MdMoneyOff } from "react-icons/md";
import { ImWarning } from "react-icons/im";

import { createFoodSchema, updateFoodSchema } from "../schemas/food.schema";

export const FoodsList = ({ dateFilterObject }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["token", "user"]);
  const [editingRow, setEditingRow] = useState(null);
  const [isCreatingNewRow, setisCreatingNewRow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(1);
  const [form] = Form.useForm();
  const [foods, setFoods] = useState([]);

  const { loggedInUser } = useContext(userContext);

  const columns = [
    {
      key: 1,
      title: "ID",
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
              <Input placeholder="enter food's name" />
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
              <DatePicker showTime />
            </Form.Item>
          );
        } else return <p>{text}</p>;
      },
    },
    {
      key: 4,
      title: "Calorie(cal)",
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
              <Input placeholder="enter the calorie value" />
            </Form.Item>
          );
        } else
          return (
            <>
              <p>{text}</p>
              {/* <p>{record.dailyTotalCalorie}</p> */}
              {record.dailyTotalCalorie > record.user?.dailyCalorieLimit && (
                <Popover
                  content={`Daily Calorie limit crossed ${record.user?.dailyCalorieLimit}!!`}
                  color="#fff2c7"
                >
                  <ImWarning
                    size={15}
                    color="red"
                    style={{ marginLeft: "5%" }}
                  />
                </Popover>
              )}
            </>
          );
      },
    },
    {
      key: 5,
      title: "Price($)",
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
              <Input placeholder="enter price in dollars" />
            </Form.Item>
          );
        } else
          return (
            <>
              {text}
              <div>
                {record.monthlyTotalAmount >
                  record.user?.monthlyBudgetLimit && (
                  <Popover
                    content={`Monthly budget exceeded $${record.user?.monthlyBudgetLimit}!!`}
                    color="#fff2c7"
                  >
                    <MdMoneyOff
                      size={15}
                      color="red"
                      style={{ marginLeft: "5%" }}
                    />
                  </Popover>
                )}
              </div>
            </>
          );
      },
    },
    {
      key: 6,
      title: "Created by",
      dataIndex: "email",
      render: (text, record) => {
        if (record.id === editingRow && isCreatingNewRow) {
          return (
            <Form.Item
              name="email"
              rules={[
                {
                  required: false,
                  message: "Please enter the email id",
                },
              ]}
            >
              <Input
                disabled={loggedInUser.role === Role.User}
                placeholder="enter email id here"
              />
            </Form.Item>
          );
        } else return <p>{text}</p>;
      },
    },
    {
      key: 7,
      title: "Actions",
      render: (_, record) => {
        return (
          <>
            {editingRow === null && (
              <Button
                type="link"
                onClick={() => {
                  setEditingRow(record.id);

                  form.setFieldsValue({
                    name: record.name,
                    datetime: moment(record.datetime),
                    calorie: record.calorie,
                    price: record.price,
                  });
                }}
              >
                Edit
              </Button>
            )}
            {!isCreatingNewRow && (
              <Button type="link" onClick={() => deleteFood(record)}>
                Delete
              </Button>
            )}
          </>
        );
      },
    },
  ].filter((column) => {
    if (loggedInUser.role === Role.User) {
      return column.key !== 7 && column.key !== 6;
    } else if (
      loggedInUser.role === Role.Admin &&
      (isCreatingNewRow || editingRow != null)
    )
      return column.key !== 7;
    else return true;
  });

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
      // const dateTime = new Date(date + " " + time);
      const newObj = {
        id,
        name,
        datetime: date + " " + time,
        calorie,
        price,
        email: user.email,
        dailyTotalCalorie,
        monthlyTotalAmount,
        user,
      };
      newData.push(newObj);
    }
    return newData;
  };

  useEffect(() => {
    getFoods({ page: currentPage, ...dateFilterObject });
  }, [currentPage, dateFilterObject]);

  const getFoods = async (filterObj) => {
    try {
      const data = await FoodService.getFoods(
        cookies.token,
        loggedInUser,
        filterObj
      );
      // console.log(data.data);
      if (data.data.results) {
        const tableSettableData = helper(data.data.results);
        setFoods(tableSettableData);
        setTotalPages(data.data.count);
        setLimit(data.data.limit);
      } else {
        throw new Error({
          response: { data: { message: "Error while fetching food entries!" } },
        });
      }
    } catch (e) {
      openNotification(e.message);
    }
  };

  const deleteFood = async (record) => {
    try {
      await FoodService.deleteFood(record.id, cookies.token);
      openNotification("Deleted successfully!!");
      getFoods({ page: currentPage, ...dateFilterObject });
    } catch (e) {
      openNotification(e.response.data.message);
    }
  };
  const updateFood = async (id, values) => {
    const { error, value } = updateFoodSchema.validate(values);
    if (error) openNotification(error.message);
    else {
      try {
        await FoodService.updateFood(id, value, cookies.token);
        openNotification("Updated successfully!!");
        getFoods({ page: currentPage, ...dateFilterObject });
        setEditingRow(null);
      } catch (e) {
        openNotification(e.response.data.message);
      }
    }
  };
  const addFood = async (values) => {
    try {
      const { error, value } = createFoodSchema.validate(values);
      console.log({ error, value });
      if (error) openNotification(error.message);
      else {
        await FoodService.addFood(value, cookies.token);
        openNotification("New Food entry added successfully!!");
        getFoods({ page: currentPage, ...dateFilterObject });
        setEditingRow(null);
        setisCreatingNewRow(!isCreatingNewRow);
      }
    } catch (e) {
      openNotification(e.response.data.message);
    }
  };
  const handleOnFinish = async (values) => {
    values = { ...values, datetime: values.datetime.format() };
    // console.log(values, editingRow);
    if (!isCreatingNewRow) {
      // console.log("updated", isCreatingNewRow);
      await updateFood(editingRow, values);
    } else {
      // console.log("creation");
      await addFood(values);
    }
  };
  const handleAdd = async () => {
    const newFoodsArray = [{ id: undefined }, ...foods];
    // console.log(newFoodsArray);
    setFoods(newFoodsArray);
    form.setFieldsValue({
      name: "",
      datetime: "",
      calorie: "",
      price: "",
      email: "",
    });
    setEditingRow(undefined);
    setisCreatingNewRow(true);
  };
  const handleCancel = async () => {
    // console.log("Called");
    getFoods({ page: currentPage, ...dateFilterObject });
    setEditingRow(null);
    setisCreatingNewRow(false);
  };

  return (
    <>
      <Form
        form={form}
        onFinish={handleOnFinish}
        style={{ margin: "0 2rem 10rem 2rem" }}
      >
        {currentPage === 1 && !isCreatingNewRow && editingRow == null && (
          <Button
            // disabled={dateFilterObject.startDate !== undefined} //cannot add when filters being applied
            type="primary"
            onClick={handleAdd}
            style={{ margin: 10 }}
          >
            Add a Food
          </Button>
        )}

        {(isCreatingNewRow || editingRow !== null) && (
          <>
            <Button type="primary" htmlType="submit" style={{ margin: 10 }}>
              Save Row
            </Button>
            <Button
              type="primary"
              style={{ margin: 10 }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </>
        )}

        <Table
          columns={columns}
          rowKey={Math.random() * Date.now()}
          dataSource={foods}
          pagination={{
            disabled: isCreatingNewRow,
            pageSize: limit,
            current: currentPage,
            onChange: (e) => setCurrentPage(e),
            total: totalPages,
          }}
        ></Table>
      </Form>
    </>
  );
};
