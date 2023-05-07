

// create function that takes database name as first argument and table as second

const productDB = (dbName, table) => {
    const db = new Dexie(dbName);
    db.version(1).stores(table);

    db.open();

    return db;
}

const bulkCreate = (dbtable, data) => {
    let flag = emptyFields(data);

    if (flag) {
        dbtable.bulkAdd([data]);
        console.log('Data transfer success!');
    } else {
        console.log('Please provide data.')
    }

    return flag;

}

// empty field validation 

const emptyFields = object => {
    let flag = false;

    for (const value in object) {
        if (object[value] != '' && object.hasOwnProperty(value)) {
            flag = true;
        } else {
            flag = false;
        }
    }

    return flag;
}

// get ID number 
// takes in dbtable argument which in our case is db.products
// higher order function is a function that takes a function as an argument

const getID = (dbtable, fn) => {
    let index = 0;
    let sortedObjects = {};
    dbtable.count(count => {
        if (count) {
            dbtable.each(table => {
                sortedObjects = SortObjects(table);
                // takes in db.products as as first argument, increments index
                fn(sortedObjects, index++);
            })
        } else {
            // returns nothing
            fn(0);
        }
    })
}

// change order of table contents

const SortObjects = sortObjects => {
    let obj = {};
    obj = {
        id: sortObjects.id,
        name: sortObjects.name,
        size: sortObjects.size,
        price: sortObjects.price
    }
    return obj;
}

// create element in our predefined table

const CreateElement = (tagName, appendTo, fn) => {
    const element = document.createElement(tagName);

    if (appendTo) appendTo.appendChild(element);
    // access to element modifier
    if (fn) fn(element);
}



export default productDB;
export {
    bulkCreate,
    getID,
    CreateElement
};