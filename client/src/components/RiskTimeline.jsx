export default function RiskTimeline({ timeline }) {
  return (
    <div>
      <h3>Risk Timeline</h3>

      {timeline.length === 0 && <p>No risks detected</p>}

      {timeline.map((r, i) => (
        <div
          key={i}
          style={{
            borderLeft: `4px solid ${
              r.severity >= 4 ? "red" : r.severity >= 2 ? "orange" : "green"
            }`,
            paddingLeft: "8px",
            marginBottom: "10px",
          }}
        >
          <strong>{r.type}</strong>
          <div>{r.message}</div>
          <small>{new Date(r.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
