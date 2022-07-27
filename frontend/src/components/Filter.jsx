import { Button, DatePicker } from "antd";

import React, { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
const { RangePicker } = DatePicker;

export const Filter = ({ setDateFilterObject }) => {
  const [filterDate, setFilterDate] = useState({});
  const [isdateRangeSelected, setIsDateRangeSelected] = useState(false);
  const [canBeCleared, setCanBeCleared] = useState(false);

  const onRangeChange = (dateString) => {
    console.log("called", dateString);
    if (dateString) {
      setFilterDate({
        startDate: dateString[0].format("YYYY-MM-DD HH:mm:ss"),
        endDate: dateString[1].format("YYYY-MM-DD HH:mm:ss"),
      });
      setIsDateRangeSelected((prev) => !prev);
    } else {
      setDateFilterObject({});
      setCanBeCleared((prev) => !prev);
    }
  };
  const handleApply = () => {
    setDateFilterObject(filterDate);
    setCanBeCleared((prev) => !prev);
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
        disabled={canBeCleared}
        type="primary"
        onClick={handleApply}
        style={{ margin: 10 }}
      >
        {!canBeCleared ? "Apply Filter" : `Clear Filter manually`}
      </Button>
    </>
  );
};
