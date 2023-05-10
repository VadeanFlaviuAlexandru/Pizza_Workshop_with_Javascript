import productDB, { bulkCreate, getID, CreateElement } from "./module.js";

let db = productDB("ProductDB", {
  products: `++id, name, size, price`,
  users: `++id,name,password`
});

const userID = document.getElementById("userID");
const productName = document.getElementById("productName");
const size = document.getElementById("size");
const price = document.getElementById("price");

const btnCreate = document.getElementById("btnCreate");
const btnRead = document.getElementById("btnRead");
const btnUpdate = document.getElementById("btnUpdate");
const btnDelete = document.getElementById("btnDelete");

btnCreate.onclick = (event) => {
  let flag = bulkCreate(db.products, {
    name: productName.value,
    size: size.value,
    price: price.value,
  });
  console.log(flag);
  productName.value = size.value = price.value = "";
  getID(db.products, (data) => {
    userID.value = data.id + 1 || 1;
  });
  ReadTable();
};

btnRead.onclick = ReadTable;

btnUpdate.onclick = () => {
  const id = parseInt(userID.value || 0);
  if (id) {
    db.products
      .update(id, {
        name: productName.value,
        size: size.value,
        price: price.value,
      })
    productName.value = size.value = price.value = "";
    ReadTable();
  } else {
    console.log(`Please Select id: ${id}`);
  }
};

function ReadTable() {
  const tbody = document.getElementById("tbody");
  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }
  getID(db.products, (data) => {
    if (data) {
      CreateElement("tr", tbody, (tr) => {
        for (const value in data) {
          CreateElement("td", tr, (td) => {
            td.textContent = value === "price" ? `$ ${data[value]}` : data[value];
          });
        }
        CreateElement("td", tr, (td) => {
          CreateElement("i", td, (i) => {
            i.className += "fas fa-edit btnEdit";
            i.setAttribute(`data-id`, data.id);
            i.onclick = EditPost;
          });
        });
        CreateElement("td", tr, (td) => {
          CreateElement("i", td, (i) => {
            i.className += "fas fa-trash-alt btnTrash";
            i.setAttribute(`data-id`, data.id);
            i.onclick = DeletePost;
          });
        });
      });
    }
  });
}

function EditPost(event) {
  let id = parseInt(event.target.dataset.id);
  db.products.get(id, (data) => {
    userID.value = data.id || 0;
    productName.value = data.name || "";
    size.value = data.size || "";
    price.value = data.price || 0;
  });
}

function DeletePost(event) {
  let id = parseInt(event.target.dataset.id);
  db.products.delete(id);
  ReadTable();
}

btnDelete.onclick = () => {
  db.delete();
  db = productDB("ProductDB", {
    products: `++id, name, size, price`,
  });
  db.open();
  ReadTable();
};
