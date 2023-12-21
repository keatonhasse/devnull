function open(name, callback) {
  indexedDB.open(name).onsuccess = (e) => {
    const db = e.target.result;
    const store = db.transaction('groups', 'readwrite').objectStore('groups');
    callback(store);
  };
}

export default async function getGroups() {
  return new Promise((resolve, reject) => {
    open('devnull', (store) => {
      store.getAll().onsuccess = (e) => {
        resolve(e.target.result);
      }
    });
  });
}
