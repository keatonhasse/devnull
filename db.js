function open(name, mode, callback) {
  indexedDB.open(name).onsuccess = (e) => {
    const db = e.target.result;
    const store = db.transaction('groups', mode).objectStore('groups');
    callback(store);
  };
}

export function restoreGroup(group) {
  open('devnull', 'readonly', (store) => {
    store.get(group).onsuccess = (e) => {
      const tabs = e.target.result.tabs;
      tabs.forEach((tab) => browser.tabs.create({ url: tab.url }));
    }
  });
}

export function deleteGroup(group) {
  open('devnull', 'readwrite', (store) => store.delete(group));
}

export function removeTabFromGroup(index, group) {
  open('devnull', 'readwrite', (store) => {
    store.get(group).onsuccess = (e) => {
      const item = e.target.result;
      item.tabs.splice(index, 1);
      store.put(item);
    }
  });
}

export async function getGroups() {
  return new Promise((resolve) => {
    open('devnull', 'readonly', (store) => {
      store.getAll().onsuccess = (e) => resolve(e.target.result.reverse());
    });
  });
}
