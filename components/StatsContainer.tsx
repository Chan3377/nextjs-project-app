"use client";
import { useQuery } from "@tanstack/react-query";
import { getStatsAction } from "@/utils/actions";
import StatsCard from "./StatsCard";

function StatsContainer() {
  const { data } = useQuery({
    queryKey: ["stats"],
    queryFn: () => getStatsAction(),
  });

  return (
    <div className="grid md:grid-cols-2 gap-4 lg:grid-cols-3">
      <StatsCard title="pending projects" value={data?.pending || 0} />
      <StatsCard title="in progress set" value={data?.progress || 0} />
      <StatsCard title="projects done" value={data?.done || 0} />
    </div>
  );
}
export default StatsContainer;
