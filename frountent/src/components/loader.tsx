export default function Loader() {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p>Loading...</p>
    </div>
  );
}

const styles: any = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  spinner: {
    width: "30px",
    height: "30px",
    border: "4px solid #ddd",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

