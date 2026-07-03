export default function Layout({ sidebar, topbar, children }) {
  return (
    <div className="layout">
      {sidebar}
      <div className="main">
        {topbar}
        {children}
      </div>
    </div>
  );
}