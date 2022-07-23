import { Card } from "antd";
import styles from "./styles/usercard.module.css";

const UserCard = ({ user }) => {
  return (
    <Card
      className={styles.card}
      style={{
        width: 300,
      }}
    >
      <p>{user.id}</p>
      <p>{user.name}</p>
      <p>{user.email}</p>
      <p>{user.role}</p>
    </Card>
  );
};

export default UserCard;
