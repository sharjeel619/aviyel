import { Button } from "antd";
import PlusWhite from '../../assets/images/plus-white.png';
import "./index.scss";
const Header = ({ createInvoice }) => {
  return (
    <div className="main-header">
      <p>Dashboard</p>
      <button onClick={createInvoice} className="create-invoice"><img src={PlusWhite} alt="Plus" /></button>
    </div>
  );
}

export default Header;