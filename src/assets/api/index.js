// const baseURL = "https://aviyel.herokuapp.com/"
const baseURL = "http://localhost:9999/";

const getAllInvoices = () => {
  return fetch(`${baseURL}getAllInvoices`).then((res) => res.json());
};

const saveInvoice = (data) => {
  return fetch(`${baseURL}createInvoice`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};

export { getAllInvoices, saveInvoice };
