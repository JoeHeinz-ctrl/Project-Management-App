import { useEffect, useState } from "react";
import { fetchTasks } from "./services/api";

const styles: any = {
  container: {
    padding: "40px",
    color: "white",
  },
  board: {
    display: "flex",
    gap: "20px",
    width: "100%",
    marginTop: "20px",
  },
  column: {
    flex: 1,
    background: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    minHeight: "400px",
  },
  title: {
    marginBottom: "15px",
    fontWeight: "bold",
  },
  card: {
    background: "#334155",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
  },
};

export default function App() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
  fetchTasks()
    .then(data => {
      console.log("TASKS FROM API:", data);
      setTasks(Array.isArray(data) ? data : []);
    })
    .catch(err => console.error("API ERROR:", err));
}, []);


  const normalizeStatus = (s: string) => {
  if (!s) return "todo";

  s = s.toLowerCase().trim();

  if (s.includes("todo")) return "todo";
  if (s.includes("doing")) return "doing";
  if (s.includes("done")) return "done";

  return "todo";
};


const renderTasks = (status: string) =>
  tasks
    .filter(t => normalizeStatus(t.status) === status)
    .map(t => (
      <div key={t.id} style={styles.card}>
        {t.title}
      </div>
    ));


  return (
    <div style={styles.container}>
      <h1>Project Board({tasks.length})</h1>

      <div style={styles.board}>
        <div style={styles.column}>
          <div style={styles.title}>TODO</div>
          {renderTasks("todo")}
        </div>

        <div style={styles.column}>
          <div style={styles.title}>DOING</div>
          {renderTasks("doing")}
        </div>

        <div style={styles.column}>
          <div style={styles.title}>DONE</div>
          {renderTasks("done")}
        </div>
      </div>
    </div>
  );
}
