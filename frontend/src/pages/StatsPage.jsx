import { Card, Col, Row, Table } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { userContext } from "../contexts/user.context";
import { FoodService } from "../services/foods.service";
import { inviteFriend } from "../services/user.service";

export const StatsPage = () => {
  const [cookie, setCookie, removeCookie] = useCookies(["user", "token"]);
  const { loggedInUser } = useContext(userContext);
  const [prevWeekEntries, setPrevWeekEntries] = useState(0);
  const [thisWeekEntries, setThisWeekEntries] = useState(0);
  const [users, setUsers] = useState([]);
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
      title: "Role",
      dataIndex: "role",
    },
    {
      key: 5,
      title: "Average Calories",
      dataIndex: "avgcal",
    },
  ];

  useEffect(() => {
    getStats();
  }, []);
  const getStats = async () => {
    const { data } = await FoodService.getStats(cookie.token);
    console.log(data.response.data);

    setUsers(data.response.data.users);
    setPrevWeekEntries(data.response.data.prevWeekEntries);
    setThisWeekEntries(data.response.data.thisWeekEntries);
  };

  return (
    <div className="site-card-wrapper">
      <h1 style={{ textAlign: "center", margin: 10 }}>User Statistics</h1>
      <Card title="Entries this week Vs Entries last week" bordered={true}>
        <ul>
          <li>This Week, {thisWeekEntries} entries were registered</li>
          <li>Last Week, {prevWeekEntries} entries were registered</li>
        </ul>
      </Card>
      <Table
        columns={columns}
        dataSource={users}
        style={{ margin: "2rem" }}
        pagination={{ pageSize: 5 }}
      ></Table>
    </div>
  );
};
