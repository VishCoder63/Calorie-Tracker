import { useState } from "react";
import { Filter } from "../components/Filter";
import { FoodsList } from "../components/FoodsList";
import styles from "../components/styles/foodEntries.module.css";

export const FoodEntriesPage = () => {
  const [dateFilterObject, setDateFilterObject] = useState({});
//   console.log(dateFilterObject);
  return (
    <>
      <div className={styles["filterContainer"]}>
        <Filter setDateFilterObject={setDateFilterObject} />
      </div>
      <FoodsList dateFilterObject={dateFilterObject} />
    </>
  );
};
