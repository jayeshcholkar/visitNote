import { Card } from "antd";
import { CardBarChart2 } from "./style";
import NewCustomerImage from "../../static/images/NewCustomer.png";

export const ProfileSection = () => {
  return (
    <Card style={{ marginBottom: 16 }}>
      <CardBarChart2>
        <div className="icon-box box-secondary">
          <img src={NewCustomerImage} alt="" />
        </div>
        <div className="card-chunk">
          <h2>Charles Williams</h2>
          <h6>Attorney, 42</h6>
          <p>
            <label>Insurance: </label>
            <span>AETNA</span>
          </p>
          <p>
            <label>Last Prescription: </label>
            <span>Diclofenac 50mg</span>
          </p>
        </div>
      </CardBarChart2>
    </Card>
  );
};
