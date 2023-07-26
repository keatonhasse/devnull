browser.runtime.onInstalled.addListener(() => {
  const DBOpenRequest = indexedDB.open("void");
  DBOpenRequest.onerror = (event) => {
    console.error(`Database error: ${event.target.errorCode}`);
  }
  DBOpenRequest.onupgradeneeded = (event) => {
    const db = event.target.result;
    const objectStore = db.createObjectStore("groups", { keyPath: "timestamp" });
    objectStore.createIndex("title", "title", { multiEntry: true });
    objectStore.createIndex("tabs", "tabs", { multiEntry: false });
  }
});

async function getTabs() {
  const tabs = await browser.tabs.query({currentWindow: true, pinned: false });
  const tabList = tabs.map(tab => {
    return {
      id: tab.id,
      title: tab.title,
      url: tab.url
    }
  }).reverse();
  return tabList;
}

async function saveTabs(tabs) {
  indexedDB.open("void").onsuccess = (event) => {
    db = event.target.result;
    const transaction = db.transaction("groups", "readwrite");
    const store = transaction.objectStore("groups");
    store.openCursor().onsuccess = (event) => {
      const group = {
        timestamp: Date.now(),
        title: "",
        tabs: tabs.map(tab => {
          delete tab.id;
          return tab;
        }).filter(tab => {
          return (tab.url !== "about:newtab")
        })
      };
      store.add(group);
    }
  }
}

async function closeTabs(tabs) {
  await browser.tabs.remove(tabs.map(tab => {
    return tab.id;
  }));
  await browser.tabs.create({});
}

async function voidTabs() {
  getTabs()
    .then(async (tabs) => {
      await saveTabs(tabs);
      await closeTabs(tabs);
    })
    .catch(error => {
      console.error(error);
    });
}

browser.browserAction.onClicked.addListener(voidTabs);
