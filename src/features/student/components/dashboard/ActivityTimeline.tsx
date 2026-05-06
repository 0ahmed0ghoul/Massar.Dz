import { formatDistanceToNow } from "date-fns";
import { Activity } from "../../../../types/activity";
import { useActivity } from "../../hooks/useActivity";

interface ActivityTimelineProps {
  activities?: Activity[];   
  loading?: boolean;
}

const ActivityTimeline = ({ activities: propActivities, loading: propLoading }: ActivityTimelineProps) => {
  const { activities: hookActivities, loading: hookLoading } = useActivity();
  const activities = propActivities ?? hookActivities;
  const loading = propLoading ?? hookLoading;

  const getActivityStyle = (type: string) => {
    switch (type) {
      case "profile_view":
        return { icon: "👁️", color: "bg-blue-500" };
      case "profile_updated":
        return { icon: "✏️", color: "bg-gray-500" };
      case "profile_completed":
        return { icon: "✅", color: "bg-green-500" };
      case "application_submitted":
        return { icon: "📄", color: "bg-green-500" };
      case "skill_assessment":
        return { icon: "📊", color: "bg-purple-500" };
      case "certificate_added":
        return { icon: "🏅", color: "bg-yellow-500" };
      case "job_saved":
        return { icon: "💾", color: "bg-cyan-500" };
      case "message_received":
        return { icon: "💬", color: "bg-indigo-500" };
      case "interview_scheduled":
        return { icon: "📅", color: "bg-orange-500" };
      default:
        return { icon: "📌", color: "bg-gray-400" };
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
        <h2 className="mb-6 text-lg font-bold text-foreground">Activity Feed</h2>
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#639922] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
        <h2 className="mb-6 text-lg font-bold text-foreground">Activity Feed</h2>
        <div className="text-center text-foreground/40 text-sm py-6">
          No activities yet. Start exploring!
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
      <h2 className="mb-6 text-lg font-bold text-foreground">Activity Feed</h2>
      <div className="relative space-y-5 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-16px)] before:w-[1px] before:bg-white/10">
        {activities.map((activity) => {
          const { icon, color } = getActivityStyle(activity.type);
          return (
            <div key={activity.id} className="relative pl-6">
              <div className={`absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full ${color} shadow-glow`} />
              <p className="text-sm font-medium text-foreground/80">{activity.title}</p>
              {activity.description && (
                <p className="text-xs text-foreground/50 mt-0.5">{activity.description}</p>
              )}
              <p className="text-[11px] text-foreground/30 mt-1">
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityTimeline;