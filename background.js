browser.runtime.onInstalled.addListener(() => {
  const request = indexedDB.open('devnull');
  request.onerror = (e) => {
    console.error(`Database error: ${e.target.errorCode}`);
  }
  request.onupgradeneeded = (e) => {
    const db = e.target.result;
    const store = db.createObjectStore('groups', { keyPath: 'timestamp' });
    store.createIndex('timestamp', 'timestamp');
  }
});

async function getTabs() {
  const tabs = await browser.tabs.query({ currentWindow: true, pinned: false });
  const tabList = tabs.map(tab => {
    return {
      id: tab.id,
      title: tab.title,
      url: tab.url
    }
  }).filter(tab => {
    return (tab.url !== 'about:newtab')
  });
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
        return (tab.url !== 'about:newtab' && !/moz-extension:\/\/[a-z]*\/devnull.html/.test(tab.url))
      })
    };
    store.add(group);
  }
}

async function closeTabs(tabs) {
  await browser.tabs.remove(tabs.map(tab => {
    return tab.id;
  }).filter(tab => {
    return (!/moz-extension:\/\/[a-z]*\/devnull.html/.test(tab.url))
  }));
  browser.tabs.query({ url: 'moz-extension://*/devnull.html' }, (tab) => {
    if (!tab.length) return browser.tabs.create({ url: 'devnull.html' });
    //browser.tabs.create({});
    browser.tabs.update(tab[0].id, { active: true });
  });
  /*const create = true;
  tabs.forEach((tab) => {
    if (/moz-extension:\/\/[a-z]*\/devnull.html/.test(tab.url)) {
      console.log('already open');
      browser.tabs.update(tab.id, { active: true });
      create = false;
    }
  });
  if (create) {*/
    //await browser.tabs.create({ url: 'devnull.html', active: true, pinned: true });
    //await browser.tabs.create({});
  //}
}

browser.browserAction.onClicked.addListener(async () => {
  await getTabs()
    .then(async (tabs) => {
      console.log(tabs);
      if (tabs.length != 0) {
        console.log('test');
        await saveTabs(tabs);
        await closeTabs(tabs);
      }
    })
    .catch(error => {
      console.error(error);
    });
});
