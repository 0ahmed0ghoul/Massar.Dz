const StatsCards = ({ stats }: { stats: any[] }) => {
    return (
      <div className="grid gap-6 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-4 border rounded">
            <p className="text-white text-xl">{stat.value}</p>
            <p className="text-white/40 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default StatsCards;