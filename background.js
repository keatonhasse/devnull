browser.runtime.onInstalled.addListener(() => {
  const request = indexedDB.open('devnull');
  request.onerror = (e) => {
    console.error(`Database error: ${e.target.errorCode}`);
  }
  request.onupgradeneeded = (e) => {
    const db = e.target.result;
    const store = db.createObjectStore('groups', { keyPath: 'timestamp' });
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
  indexedDB.open('devnull').onsuccess = (e) => {
    db = e.target.result;
    const store = db.transaction('groups', 'readwrite').objectStore('groups');
    const group = {
      timestamp: Date.now(),
      title: 'untitled unmastered',
      tabs: tabs.map(tab => {
        delete tab.id;
        return tab;
      }).filter(tab => {
        return (tab.url !== 'about:newtab')
      })
    };
    //group.urls = tabs.map(tab => tab.url).filter(tab => { return (tab.url !== 'about:newtab' )});
    store.add(group);
  }
}

async function closeTabs(tabs) {
  await browser.tabs.remove(tabs.map(tab => {
    return tab.id;
  }));
  //await browser.tabs.create({});
  await browser.tabs.create({ url: 'devnull.html' });
}

browser.browserAction.onClicked.addListener(async () => {
  await getTabs()
    .then(async (tabs) => {
      await saveTabs(tabs);
      await closeTabs(tabs);
    })
    .catch(error => {
      console.error(error);
    });
});
