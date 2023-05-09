import productDB, { bulkCreate, getID, CreateElement } from "./module.js";

let db = productDB("ProductDB", {
  products: `++id, name, size, price`,
});

// GET INPUT ELEMENTS

const userID = document.getElementById("userID");
const productName = document.getElementById("productName");
const size = document.getElementById("size");
const price = document.getElementById("price");

// get buttons

const btnCreate = document.getElementById("btnCreate");
const btnRead = document.getElementById("btnRead");
const btnUpdate = document.getElementById("btnUpdate");
const btnDelete = document.getElementById("btnDelete");

// insert value with create button

btnCreate.onclick = (event) => {
  let flag = bulkCreate(db.products, {
    name: productName.value,
    size: size.value,
    price: price.value,
  });

  console.log(flag);

  productName.value = size.value = price.value = "";

  getID(db.products, (data) => {
    // changing the number of the ID.. if we have already a record in our database, it will be +1.. if we don't, then we specify first
    userID.value = data.id + 1 || 1;
  });
  ReadTable();
};

// read data from database

btnRead.onclick = ReadTable;

// update database

btnUpdate.onclick = () => {
  const id = parseInt(userID.value || 0);
  if (id) {
    // call dexie update method
    db.products
      .update(id, {
        name: productName.value,
        size: size.value,
        price: price.value,
      })
      .then((updated) => {
        // let get = updated ? `data updated` : `couldn't update data`;
        let get = updated ? true : false;

        // // display message
        // let updatemsg = document.querySelector(".updatemsg");
        // getMsg(get, updatemsg);

        // proname.value = size.value = price.value = "";
        // //console.log(get);
      });
    productName.value = size.value = price.value = "";
    ReadTable();
  } else {
    console.log(`Please Select id: ${id}`);
  }
};

function ReadTable() {
  const tbody = document.getElementById("tbody");

  // empty out the duplicates

  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }

  getID(db.products, (data) => {
    if (data) {
      CreateElement("tr", tbody, (tr) => {
        // executes 4 times for all values in data
        for (const value in data) {
          CreateElement("td", tr, (td) => {
            td.textContent = value === "price" ? `$ ${data[value]}` : data[value];
          });
        }

        // append buttons to our current row

        // EDIT button
        CreateElement("td", tr, (td) => {
          // create i tag
          CreateElement("i", td, (i) => {
            i.className += "fas fa-edit btnEdit";

            // assign data-id attribute to i icon
            i.setAttribute(`data-id`, data.id);

            // EDIT individual post functionality ..
            // copies current values from the database into the active input
            i.onclick = EditPost;
          });
        });

        // DELETE button
        CreateElement("td", tr, (td) => {
          // create i tag
          CreateElement("i", td, (i) => {
            i.className += "fas fa-trash-alt btnTrash";

            // assign data-id attribute to i icon
            i.setAttribute(`data-id`, data.id);

            i.onclick = DeletePost;
          });
        });
      });
    }
  });
}

function EditPost(event) {
  // get the id of the clicked tr, we get a string out.. parse it, get a number
  let id = parseInt(event.target.dataset.id);

  db.products.get(id, (data) => {
    // set the input values to the values of the according ID from database

    userID.value = data.id || 0;
    productName.value = data.name || "";
    size.value = data.size || "";
    price.value = data.price || 0;
  });
}

function DeletePost(event) {
  // get id
  let id = parseInt(event.target.dataset.id);

  // using dexie.js function
  db.products.delete(id);

  ReadTable();
}

// delete ALL

btnDelete.onclick = () => {
  // using dexie.js method to delete the whole database

  db.delete();

  // created the database again according to the same specifications
  db = productDB("ProductDB", {
    products: `++id, name, size, price`,
  });

  // open database
  db.open();

  // update table
  ReadTable();
};
