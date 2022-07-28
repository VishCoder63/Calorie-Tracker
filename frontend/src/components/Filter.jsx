import { Button, DatePicker } from "antd";

import React, { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
const { RangePicker } = DatePicker;

export const Filter = ({ setDateFilterObject }) => {
  const [filterDate, setFilterDate] = useState({});
  const [isdateRangeSelected, setIsDateRangeSelected] = useState(false);
  const [filterEmpty, setFilterEmpty] = useState(true);

  const onRangeChange = (dateString) => {
    // console.log("called", dateString);

    if (dateString) {
      setFilterDate({
        startDate: dateString[0].format("YYYY-MM-DD HH:mm:ss"),
        endDate: dateString[1].format("YYYY-MM-DD HH:mm:ss"),
      });
      setFilterEmpty(false);
    } else {
      setDateFilterObject({});
      setFilterEmpty(true);
    }
  };
  const handleApply = () => {
    setDateFilterObject(filterDate);
    setFilterEmpty(true);
  };
  return (
    <>
      <RangePicker
        showTime={{
          format: "HH:mm",
        }}
        format="YYYY-MM-DD HH:mm"
        onChange={onRangeChange}
      />
      <Button
        disabled={filterEmpty}
        type="primary"
        onClick={handleApply}
        style={{ margin: 10 }}
      >
        Apply Filter
      </Button>
    </>
  );
};
