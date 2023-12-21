export const styles = `
  <style>
    ol {
      list-style: none;
    }
  </style>
`;

export const template = (groups) => `
  ${groups.map((group) => `
    <li>
      <div>
        <h2>${group.title}</h2>
        <!-- <h2>count</h2> -->
        <div>created ${new Date(group.timestamp).toLocaleString('en-US', { hour12: false })}</div>
        <button>restore</button><button>delete</button>
      </div>
      <ol>
        ${group.tabs.map((tab) => `
          <li>
            <a href="${tab.url}">${tab.title}</a><button>remove</button>
          </li>
        `).join('')}
      </ol>
    </li>
  `).join('')}
`;
