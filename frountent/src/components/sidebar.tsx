export default function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      <h3>Menu</h3>
      <ul style={styles.list}>
        <li style={styles.item}>Projects</li>
        <li style={styles.item}>Tasks</li>
        <li style={styles.item}>Settings</li>
      </ul>
    </aside>
  );
}

const styles: any = {
  sidebar: {
    width: "200px",
    minHeight: "100vh",
    background: "#f0f0f0",
    padding: "15px",
    boxSizing: "border-box",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  item: {
    padding: "8px 0",
    cursor: "pointer",
  },
};

