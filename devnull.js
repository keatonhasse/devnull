document.addEventListener('DOMContentLoaded', () => {
  getGroups();
});

function restoreGroup() {

}

function deleteGroup(group) {
  //const parent = e.currentTarget.parentNode;
  //document.getElementsByClassName('restore-button')['0'].parentNode.parentNode.querySelector('ol').className
  //console.log(parent);
  indexedDB.open('devnull').onsuccess = (e) => {
    const db = e.target.result;
    const store = db.transaction('groups', 'readwrite').objectStore('groups');
    store.delete(group);
  }
}

function createHeader(group) {
  const header = document.createElement('div');
  header.className = 'group-header';
  const title = document.createElement('h2');
  title.className = 'group-title';
  title.textContent = group.title;
  header.appendChild(title);
  const right = document.createElement('div');
  right.className = 'group-right';
  header.appendChild(right);
  const date = document.createElement('p');
  date.className = 'group-date';
  date.textContent = `created ${new Date(group.timestamp).toLocaleString()}`
  right.appendChild(date);
  const restoreButton = document.createElement('button');
  restoreButton.className = 'restore-button';
  restoreButton.textContent = 'restore';
  right.appendChild(restoreButton);
  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-button';
  deleteButton.textContent = 'delete';
  right.appendChild(deleteButton);
  return header;
}

function createGroup(group) {
  const groups = document.getElementById('groups');
  const fragment = document.createDocumentFragment();
  const list = document.createElement('li');
  list.id = group.timestamp;
  list.appendChild(createHeader(group));
  list.appendChild(document.createElement('ol'));
  fragment.append(list);
  groups.append(fragment);
}

function getGroups() {
  indexedDB.open('devnull').onsuccess = (e) => {
    const db = e.target.result;
    const store = db.transaction('groups', 'readwrite').objectStore('groups');
    store.openCursor().onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        const group = cursor.value;
        createGroup(group);
        /*const groupHTML = `<li id="${group.timestamp}">
                            <div class="group-header">
                              <h2 class="group-title">${group.title}</h2>
                              <div class="group-right">
                                <p class="group-date"></p>
                                <div class="group-actions">
                                  <button class="restore-button">restore</button>
                                  <button class="delete-button">delete</button>
                                </div>
                              </div>
                            </div>
                              <ol></ol>
                           </li>`;*/
        //groups.innerHTML += groupHTML;
        //document.getElementsByClassName(`${group.timestamp}`)['0'].parentElement.getElementsByClassName('group-date')['0'].innerHTML = `created ${new Date(group.timestamp).toLocaleString('en-US', { hour12: false })}`;
        const item = document.getElementById(`${group.timestamp}`);
        //item.querySelector('.group-date').innerHTML = `created ${new Date(group.timestamp).toLocaleString()}`;
        //groups.querySelector(`li#${group.timestamp} div.group-header div.group-right p.group-date`).innerHTML = `created ${new Date(group.timestamp).toLocaleString()}`;
        item.addEventListener('click', (e) => {
          if (e.target.className == 'restore-button') {
            console.log('clicked restore!');
          }
          if (e.target.className == 'delete-button') {
            //console.log('clicked delete!');
            //const id = document.getElementById(`${group.timestamp}`).parentElement;
            groups.removeChild(item);
            //console.log(id);
            //deleteGroup(group.timestamp);
            //console.log(e.target.parentElement.parentElement.parentElement.parentElement.parentElement);
            //e.parentElement.removeChild(e);
          }
        });
        item.querySelector('ol').innerHTML = group.tabs.map(tab => `<li class="tab-title"><a href="${tab.url}" target="_blank" rel="noopener noreferrer" class="tab-url">${tab.title}</a></li>`).join(' ');
        //document.querySelector('.restore-button').onclick = restoreGroup();
        //document.querySelector('.delete-button').onclick = deleteGroup();
        //document.getElementById(`${group.timestamp}`).innerHTML += group.tabs.map(tab => `<li class="tab-title"><a href="${tab.url}" target="_blank" rel="noopener noreferrer" class="tab-url">${tab.title}</a></li>`).join(' ');
        //document.getElementsByClassName(`${group.timestamp}`)['0'].innerHTML = group.tabs.map(tab => `<li class="tab-title"><a href="${tab.url}" target="_blank" rel="noopener noreferrer" class="tab-url">${tab.title}</a></li>`).join(' ');
        cursor.continue();
      }
    };
  };
}
