import { Row, Col, Modal, Form, Input, Button, Table, message, InputNumber } from "antd";
import Header from "../../components/Header";
import SideBar from "../../components/Sidebar";
import Invoice from "../../components/Invoice";
import { calculateTotalPrice, addCommaToPrice } from "../../assets/util"
import { getAllInvoices, saveInvoice } from "../../assets/api"
import invoiceListJSON from "../../assets/data/aviyel.json";
import SkipIcon from "../../assets/images/skip-icon.png";
import EnterIcon from "../../assets/images/enter-icon.png"
import EditIcon from "../../assets/images/edit.png"
import "../../assets/styles/main.scss";
import "./index.scss";
import { createRef, useState, useEffect } from "react";
const INITIAL_PRICE_STATE = {
  subTotal: 0,
  tax: 0,
  discount: 0,
  grandTotal: 0,
  tax_percentage: 0,
  discount_percentage: 0
}
const INITIAL_INVOICE_LIST_STATE = {
  isLoading: true,
  invoices: []
}

const tableCol = [
  {
    title: 'Item',
    dataIndex: 'name',
    key: 'name',
    align: 'left',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    align: 'center',
  },
  {
    title: 'Price - ₹',
    dataIndex: 'price',
    key: 'price',
    align: 'right',
  },
]
const Home = () => {
  const [selectedInvoiceData, setSelectedInvoiceData] = useState()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [invoiceList, setInvoiceList] = useState(INITIAL_INVOICE_LIST_STATE)
  const [isLoading, setIsLoading] = useState(false)
  const [prices, setPrices] = useState(INITIAL_PRICE_STATE)
  const [orderNo, setOrderNo] = useState(Math.floor(Math.random() * 1000))
  const [step, setStep] = useState(0)
  const [formValues, setFormValues] = useState()
  const [isCustomerFormValid, setCustomerFormValid] = useState(false)
  const [productList, setProductList] = useState([])
  const [taxPercent, setTaxPercent] = useState(0)
  const [discountPercent, setDiscountPercent] = useState(0)
  const submitBtnref = createRef()

  useEffect(() => {
    fetchAllInvoices()
  }, [])

  useEffect(() => {
    if (!productList.length) return
    const [subTotal, tax, discount, grandTotal] = calculateTotalPrice({ items: productList, tax_percentage: taxPercent, discount_percentage: discountPercent })
    setPrices(prevValues => ({
      ...prevValues,
      subTotal,
      tax,
      discount,
      grandTotal
    }))
  }, [productList.length, taxPercent, discountPercent])

  useEffect(() => {
    if (isModalVisible) return
    setStep(0)
    setProductList([])
    setPrices(INITIAL_PRICE_STATE)
    setTaxPercent(0)
    setDiscountPercent(0)
  }, [isModalVisible])

  const fetchAllInvoices = async () => {
    try {
      const data = await getAllInvoices()
      const { error, result } = data
      if (result) {
        setInvoiceList(prev => ({
          invoices: [...result],
          isLoading: false
        }))
      }
      else {
        message.error("Error while fetching Invoices!")
      }
    }
    catch (e) {
      message.error("Error while fetching Invoices!")
      setInvoiceList(prev => ({
        ...prev,
        isLoading: false
      }))
    }
  }
  const createInvoice = async (obj) => {
    try {
      setIsLoading(true)
      const data = await saveInvoice(obj)
      const { error, result } = data
      if (result?.acknowledged) {
        message.success("Invoice Created!")
        setIsModalVisible(false)
        setInvoiceList(prev => ({
          ...prev,
          invoices: [...prev.invoices, obj]
        }))
      }
      else {
        message.error("Error while creating an Invoice!")
      }
    }
    catch (e) {
      message.error("Error while fetching Invoices!")
    }
    finally {
      setIsLoading(false)
    }
  }
  const onCustomerFormSubmit = (values) => {
    setCustomerFormValid(true)
    setFormValues(values)
    setStep(1)
  }
  const onModalFooterBtnClick = () => {
    if (step) {
      if (!productList.length) {
        message.error("Add at least 1 product to create an Invoice!")
        return
      }
      const obj = { ...prices, ...formValues, items: productList, order_no: orderNo, invoice_id: `INV${Math.floor(Math.random() * 1000)}`, admin_first_name: "John", admin_last_name: "Doe", created_at: Date.now(), tax_percentage: taxPercent, discount_percentage: discountPercent }
      createInvoice(obj)
    }
    else {
      submitBtnref.current.click()
    }
  }
  const onAddProduct = (values) => {
    const { tax_percentage, discount_percentage } = values
    setPrices((prev) => ({
      ...prev,
      tax_percentage: tax_percentage || 0,
      discount_percentage: discount_percentage || 0
    }))
    setProductList(prev => [...prev, { ...values, key: `invoice-item-${prev.length + 1}` }])
  }

  const onProductFormChange = (changedValues, allValues) => {
    const { discount_percentage, tax_percentage } = allValues
    setTaxPercent(tax_percentage || 0)
    setDiscountPercent(discount_percentage || 0)
  }
  const ModalHeader = (
    <Row justify="space-between">
      <Col span={12}>
        <div className="d-flex align-items-center">
          <h2 className="text-bold">Create New Invoice</h2>
          <p className="text-light-gray m-l-30">ORDER NO: {orderNo}</p>
        </div>
        <p className="m-b-0 m-t-25">
          {step ? "PRODUCT DETAILS" : "CUSTOMER DETAILS"}
        </p>
      </Col>
      <Col span={12}>
        {step ? (
          <div className="d-flex align-items-end justify-content-end m-r-50 m-t-25">
            <div>
              <span className="text-light-gray">Customer Details</span>
              <p className="text-bold m-t-10">
                {formValues?.customer_fullname}
              </p>
              <span>{formValues?.customer_email}</span>
            </div>
            <img
              onClick={() => setStep(0)}
              src={EditIcon}
              height="28"
              className="m-b-5 m-l-25 pointer"
              alt="Edit Customer Details"
            />
          </div>
        ) : (
          <div className="d-flex align-items-end justify-content-end m-r-40 m-t-50">
            <Button
              onClick={() => setStep(1)}
              type="ghost"
              className="d-flex align-items-center bg-gray text-blue"
              size="large"
            >
              SKIP <img className="m-l-20" src={SkipIcon} alt="skip" />
            </Button>
          </div>
        )}
      </Col>
    </Row>
  );
  const ModalFooter = (
    <>
      {!step ? (
        <div className={`align-items-center justify-content-end`}>
          <Button size="large" type="primary" className="w-150" onClick={onModalFooterBtnClick}>
            Proceed
          </Button>
        </div>
      ) : (
        <div className={`d-flex align-items-center justify-content-between`}>
          <div className="d-flex">
            <div className="text-center m-r-50 m-l-50">
              <p className="text-light-gray m-b-0">Tax</p>
              <h2 className="text-bold m-b-0">₹ {addCommaToPrice(prices.tax)}</h2>
            </div>
            <div className="text-center">
              <p className="text-light-gray m-b-0">Discount</p>
              <h2 className="text-bold m-b-0">₹ {addCommaToPrice(prices.discount)}</h2>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <div className="text-center m-r-50">
              <p className="text-light-gray m-b-0">Grand Total</p>
              <h2 className="text-bold m-b-0">₹ {addCommaToPrice(prices.grandTotal)}</h2>
            </div>
            <Button size="large" type="primary" className="w-150" onClick={onModalFooterBtnClick} loading={isLoading}>
              Save
            </Button>
          </div>
        </div>
      )}
    </>
  );
  return (
    <div className="home">
      <Header createInvoice={() => setIsModalVisible(true)} />
      <Modal
        visible={isModalVisible}
        centered={true}
        title={ModalHeader}
        width={window.innerWidth * 0.5}
        className="invoice-modal"
        footer={ModalFooter}
        onCancel={() => setIsModalVisible(false)}
        maskClosable={false}
        destroyOnClose={true}
      >
        <Form
          layout="vertical"
          onFinish={onCustomerFormSubmit}
          style={{ display: step ? "none" : "block" }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="customer_fullname"
                rules={[{ required: true, message: "Full name required!" }]}
                label="Full Name"
              >
                <Input placeholder="Customer Name" size="large" />
              </Form.Item>
              <Form.Item name="customer_address" label="Address">
                <Input.TextArea
                  rows={5}
                  placeholder="Complete Address"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customer_phone"
                rules={[{ required: true, message: "Phone No required!" }]}
                label="Phone Number"
              >
                <Input type="number" size="large" addonBefore="+91" />
              </Form.Item>
              <Form.Item
                name="customer_email"
                rules={[{ required: true, message: "Email required!" }]}
                label="Email ID"
              >
                <Input
                  placeholder="Customer Email Address"
                  size="large"
                  type="email"
                />
              </Form.Item>
              <Form.Item name="customer_pin_code" label="Pincode">
                <Input placeholder="560067" size="large" />
              </Form.Item>
            </Col>
            <Button type="primary" htmlType="submit" hidden ref={submitBtnref}>
              Submit
            </Button>
          </Row>
        </Form>
        <div style={{ display: !step ? "none" : "block" }}>
          <Table
            dataSource={productList}
            columns={tableCol}
            pagination={false}
          />
          <Form
            layout="vertical"
            className="m-t-15"
            onFinish={onAddProduct}
            onValuesChange={onProductFormChange}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: "Item name required!" }]}
                >
                  <Input placeholder="Please enter Item Name" size="large" />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item
                  name="quantity"
                  rules={[{ required: true, message: "Quantity required!" }]}
                >
                  <InputNumber
                    placeholder="0.00"
                    type="number"
                    size="large"
                    min={1}
                  />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item
                  name="price"
                  rules={[{ required: true, message: "Price required!" }]}
                >
                  <InputNumber
                    placeholder="0.00"
                    type="number"
                    size="large"
                    min={1}
                  />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Button type="ghost" htmlType="submit" size="large">
                  <img src={EnterIcon} alt="Add item" />
                </Button>
              </Col>
            </Row>
            <Row align="middle" justify="center" className="m-t-50" gutter={16}>
              <Col span={4}>
                <Form.Item name="tax_percentage" className="m-b-0">
                  <InputNumber
                    placeholder="Tax"
                    type="number"
                    size="large"
                    suffix="%"
                    min={.1}
                    max={99}
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="discount_percentage" className="m-b-0">
                  <InputNumber
                    placeholder="Discount"
                    type="number"
                    size="large"
                    suffix="%"
                    min={.1}
                    max={100}
                  />
                </Form.Item>
              </Col>
              <Col offset={6} span={10}>
                <div className="d-flex align-items-center justify-content-end">
                  <p className="m-r-50 m-b-0">Sub Total</p>
                  <p className="text-bold m-b-0">
                    ₹ {addCommaToPrice(prices.subTotal)}
                  </p>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
      <div className="main-container">
        <SideBar
          onInvoiceClick={(item) => setSelectedInvoiceData(item)}
          invoiceData={invoiceList.invoices}
          loading={isLoading}
        />
        <div className="right-content">
          <div className="header-title">invoice details</div>
          <Invoice invoiceData={selectedInvoiceData} />
        </div>
      </div>
    </div>
  );
}

export default Home;
