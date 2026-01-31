interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    status?: string;
  };
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div style={styles.card}>
      <h4 style={styles.title}>{task.title}</h4>
      {task.description && <p style={styles.desc}>{task.description}</p>}
      {task.status && <small style={styles.status}>{task.status}</small>}
    </div>
  );
}

const styles: any = {
  card: {
    background: "#ffffff",
    padding: "10px",
    marginBottom: "8px",
    borderRadius: "6px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  title: {
    margin: "0 0 4px 0",
    fontSize: "14px",
  },
  desc: {
    margin: 0,
    fontSize: "12px",
    color: "#555",
  },
  status: {
    fontSize: "10px",
    color: "#888",
  },
};

