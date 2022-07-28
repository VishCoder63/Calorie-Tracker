import { Card, Col, Row, Statistic, Table } from "antd";
import { LikeOutlined } from "@ant-design/icons";

import React, { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import styles from "../components/styles/statsPage.module.css";

import { FoodService } from "../services/foods.service";

export const StatsPage = () => {
  const [cookie, setCookie, removeCookie] = useCookies(["user", "token"]);

  const [prevWeekEntries, setPrevWeekEntries] = useState(0);
  const [thisWeekEntries, setThisWeekEntries] = useState(0);

  const [average, setAverage] = useState(0);

  useEffect(() => {
    getStats();
  }, []);
  const getStats = async () => {
    const { data } = await FoodService.getStats(cookie.token);
    // console.log(data.response.data);

    setAverage(data.response.data.avg);
    setPrevWeekEntries(data.response.data.prevWeekEntries);
    setThisWeekEntries(data.response.data.thisWeekEntries);
  };

  return (
    <div style={{ maxWidth: "60%", margin: "auto", textAlign: "center" }}>
      <h1 style={{ textAlign: "center", margin: "3rem" }}>User Statistics</h1>
      <Row gutter={16}>
        <Col span={12}>
          <Statistic title="Entries last week" value={prevWeekEntries} />
        </Col>
        <Col span={12}>
          <Statistic title="Entries this week" value={thisWeekEntries} />
        </Col>
        <Col span={12}>
          <Statistic
            title="Average calorie intake per user last week"
            value={`${average} calorie`}
          />
        </Col>
      </Row>
    </div>
  );
};
