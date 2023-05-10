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

const getID = (dbtable, fn) => {
    let index = 0;
    let sortedObjects = {};
    dbtable.count(count => {
        if (count) {
            dbtable.each(table => {
                sortedObjects = SortObjects(table);
                fn(sortedObjects, index++);
            })
        } else {
            fn(0);
        }
    })
}

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

const CreateElement = (tagName, appendTo, fn) => {
    const element = document.createElement(tagName);
    if (appendTo) appendTo.appendChild(element);
    if (fn) fn(element);
}

export default productDB;
export {
    bulkCreate,
    getID,
    CreateElement
};