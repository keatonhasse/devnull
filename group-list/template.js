const styles = `
  <style>
    import url('./styles.css')
  </style>
`;

const template = (groups) => `
  ${styles}
  ${groups.map((group) => `
    <li>
      <div>
        <h2>${group.title}</h2>
        <h2>count</h2>
        <div>created ${new Date(group.timestamp).toLocaleString('en-US', { hour12: false })}</div>
        <button>restore</button><button>delete</button>
      </div>
      <ol>
    </li>
  `)}
`;

export default template;
