function open(name, callback) {
  indexedDB.open(name).onsuccess = (e) => {
    const db = e.target.result;
    const store = db.transaction('groups', 'readwrite').objectStore('groups');
    callback(store);
  };
}

export default function getGroups() {
  //let groups = [];
  /*open('devnull', (store) => {
    store.getAll().onsuccess = (e) => {
      const groups = e.result;
      return groups;
    };
  });*/
  let groups = [];
  open('devnull', (store) => {
    store.openCursor().onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        groups.push(cursor.value);
        cursor.continue();
      }
    };
  });
  return groups;
  //callback(groups);
}
