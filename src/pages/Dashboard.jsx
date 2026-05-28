import ActivityFeed from "../components/ui/ActivityFeed";
import StatsCard from "../components/ui/StatsCard";
import { STATS,ACTIVITIES } from "../data/dashboardData";
import DonutChart from "../components/ui/DonutChart";
import QuickActions from "../components/ui/QuickActions";
 export default function Dashboard() {
  return (
   <>
      <div className="view active" id="view-dashboard">
          <div className="page-content">
            <div className="page-header">
              <div>
                <div className="page-title">Dashboard Overview</div>
                <div className="page-sub">
                  Welcome back, Alex. Here is what is happening across your
                  organization today.
                </div>
              </div>
            </div>

            {/*Stat Cards*/}
            <div className="stat-grid">
               {STATS.map((stat)=>{
                return <StatsCard key={stat.id} {...stat}/>
               })}
            </div>

            {/*Middle row*/}
            <div
              style={{display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px', marginBottom: '20px'}}
            >
              {/*Recent Activity*/}
              <div className="card">
                <div
                  style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px'}}
                >
                  <div style={{fontSize: '16px', fontWeight: '700'}}>
                    Recent Activity
                  </div>
                  <a
                    href="#"
                    style={{fontSize: '13px', fontWeight: '600', color: 'var(--color-brand-500)', textDecoration: 'none'}}
                    >View All</a
                  >
                </div>

                {
                  ACTIVITIES.map((item)=>{
                    return <ActivityFeed key={item.id} {...item}/>
                  })
                }
              </div>
         {/*Department Breakdown*/}
                <DonutChart/>
            </div>

            {/*Quick Actions*/}
            <QuickActions/>
          </div>
          <footer className="footer">
            <div>
              <strong>NexusHR</strong> &copy; 2024 NexusHR. Enterprise
              Intelligence.
            </div>
            <a
              href="#"
              style={{color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: '500'}}
              >Support</a>

          </footer>
        </div>

   </>
  );
}