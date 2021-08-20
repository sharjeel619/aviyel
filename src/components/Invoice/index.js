import { Result, Button, Table, Row, Col } from "antd";
import { unixDateParser, calculateTotalPrice, addCommaToPrice } from "../../assets/util";
import PrintIcon from "../../assets/images/printer-blue.png";
import "./index.scss";
import { useEffect, useState } from "react";
const INITIAL_PRICE_STATE = {
  subTotal: 0,
  tax: 0,
  discount: 0,
  grandTotal: 0
}
const Invoice = ({ invoiceData }) => {
  const [prices, setPrices] = useState(INITIAL_PRICE_STATE)
  const tableCol = [
    {
      title: 'Item',
      dataIndex: 'name',
      key: 'name',
      align: 'left'
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center'
    },
    {
      title: 'Price - ₹',
      dataIndex: 'price',
      key: 'price',
      align: 'right'
    },
  ]
  useEffect(() => {
    if (!invoiceData) return
    const [subTotal, tax, discount, grandTotal] = calculateTotalPrice(invoiceData)
    setPrices({
      subTotal,
      tax,
      discount,
      grandTotal
    })
  }, [invoiceData])
  let invoiceItems = invoiceData?.items || []
  invoiceItems = invoiceItems.map((item, index) => ({
    ...item,
    key: `invoice-item-${index}`
  }))
  return (
    <div className="invoice-container">
      <div className="header">
        {!invoiceData && <h3 className="text-bold">INVOICE</h3>}
        {invoiceData && (
          <>
            <div>
              <h3 className="text-bold">INVOICE</h3>
              <p># {invoiceData.invoice_id}</p>
              <span>{unixDateParser(invoiceData.created_at)}</span>
            </div>
            <div className="customer-details">
              <div className="m-r-25">
                <span className="text-light-gray">Customer Details</span>
                <p className="text-bold m-t-10">
                  {invoiceData?.customer_fullname}
                </p>
                <span>{invoiceData?.customer_email}</span>
              </div>
              <Button size="large" type="ghost">
                Print <img className="m-l-10" src={PrintIcon} />
              </Button>
            </div>
          </>
        )}
      </div>
      <div className="body">
        {!invoiceData && (
          <div className="empty-placeholder">
            <Result
              title={<p>Select one of the invoices from the left sidebar.</p>}
            />
          </div>
        )}
        {invoiceData && <div className="invoice-list">
          <Table dataSource={invoiceItems} columns={tableCol} pagination={false} />
        </div>}
      </div>
      <div className="m-t-30">
        {invoiceData && <Row justify="end">
          <Col span={4}>
            <p>Sub Total</p>
            <p>Tax ({invoiceData.tax_percentage}%)</p>
            <p>Discount ({invoiceData.discount_percentage}%)</p>
            <h2 className="text-bold m-t-25">Grand Total</h2>
          </Col>
          <Col span={4} className="text-right m-r-25">
            <p className="text-bold">₹ {addCommaToPrice(prices.subTotal)}</p>
            <p className="text-bold">₹ {addCommaToPrice(prices.tax)}</p>
            <p className="text-bold">₹ {prices.discount ? "-" : ""}{addCommaToPrice(prices.discount)}</p>
            <h2 className="text-bold m-t-25">₹ {addCommaToPrice(prices.grandTotal)}</h2>
          </Col>
        </Row>
        }
      </div>
    </div>
  );
}

export default Invoice;