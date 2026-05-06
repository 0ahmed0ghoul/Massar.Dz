import { Bell, AlertTriangle, Info, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";

const NotificationsPage = () => {
  const { notifications, loading } = useNotifications();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-foreground/60">Loading notifications...</div>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-400" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-foreground/40" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/20";
      case "info":
        return "bg-blue-500/10 border-blue-500/20";
      case "success":
        return "bg-green-500/10 border-green-500/20";
      default:
        return "bg-white/5 border-white/10";
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <Bell className="h-6 w-6 text-[#639922]" />
        <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
        {notifications.length > 0 && (
          <span className="rounded-full bg-[#639922] px-2.5 py-0.5 text-xs font-medium text-foreground">
            {notifications.length}
          </span>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
          <CheckCircle className="mx-auto h-12 w-12 text-[#639922] opacity-50" />
          <h3 className="mt-3 text-lg font-medium text-foreground">All caught up!</h3>
          <p className="mt-1 text-sm text-foreground/40">
            Your profile looks great. No pending notifications.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-4 rounded-xl border p-4 transition-all hover:shadow-lg ${getBgColor(notif.type)}`}
            >
              <div className="flex-shrink-0">{getIcon(notif.type)}</div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{notif.title}</h3>
                <p className="mt-0.5 text-sm text-foreground/50">{notif.description}</p>
                <Link
                  to={notif.actionLink}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#639922] hover:gap-2 transition-all"
                >
                  Complete now <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;