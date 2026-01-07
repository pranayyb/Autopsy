import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTimeline, getInsights } from "../api/risk.api";
import RiskTimeline from "../components/RiskTimeline";
import HealthBadge from "../components/HealthBadge";

export default function ProjectDetails() {
  const { id } = useParams();
  const [timeline, setTimeline] = useState([]);
  const [insight, setInsight] = useState("");

  useEffect(() => {
    getTimeline(id).then((res) => setTimeline(res.data.timeline));
    getInsights(id).then((res) => setInsight(res.data.insight));
  }, [id]);

  const maxSeverity = timeline.reduce((max, r) => Math.max(max, r.severity), 0);

  return (
    <>
      <h2>Project Health</h2>
      <HealthBadge severity={maxSeverity} />
      <p>{insight}</p>
      <RiskTimeline timeline={timeline} />
    </>
  );
}
