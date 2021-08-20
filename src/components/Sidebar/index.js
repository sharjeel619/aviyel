import { useState } from "react";
import "./index.scss";
import { Input } from "antd";
import SearchIcon from "../../assets/images/search-icon.png";
import {
  SyncOutlined
} from '@ant-design/icons';
import { parseInvoiceString, calculateTotalPrice, unixDateParser, addCommaToPrice } from "../../assets/util"
const Sidebar = ({ onInvoiceClick, invoiceData }) => {
  const [activeInvoice, setActiveInvoice] = useState("")
  const onInvoiceItemClick = (item) => {
    setActiveInvoice(item.invoice_id)
    onInvoiceClick(item)
  }
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="search-bar-container">
          <Input
            placeholder="Search..."
            className="search-bar"
            size="large"
            prefix={<img src={SearchIcon} />}
            allowClear
          />
        </div>
        <p className="invoice-heading">INVOICES - {invoiceData.length}</p>
        {!invoiceData.length && (
          <div className="text-center m-t-100">
            <SyncOutlined spin style={{ color: "#fff", fontSize: "18px" }} />
            <p className="text-white">Fetching Invoices..</p>
          </div>
        )}
        <div className="invoice-list">
          {invoiceData.map((item, index) => (
            <div
              className={`invoice-item ${item.invoice_id === activeInvoice ? "active" : ""
                }`}
              key={`invoice-item-${index}`}
              onClick={(e) => onInvoiceItemClick(item)}
            >
              <div className="row1">
                <p className="invoice-id">
                  {parseInvoiceString(item.invoice_id)}
                </p>
                <span>{unixDateParser(item.created_at)}</span>
              </div>
              <div className="row2">
                <p className="total-items">Items - {item.items.length}</p>
              </div>
              <div className="row3">
                <p className="admin-name">
                  {item.admin_first_name} {item.admin_last_name}
                </p>
                <p className="total-price">
                  ₹ {addCommaToPrice(calculateTotalPrice(item)[3])}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;