export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>NexusHR</strong> &copy; 2024 NexusHR. Enterprise Intelligence.
      </div>
      <div style={{ display: "flex", gap: "20px" }}>
        <a href="#" style={{ color: "var(--color-text-secondary)", textDecoration: "none" }}>
          Support
        </a>
        <a href="#" style={{ color: "var(--color-text-secondary)", textDecoration: "none" }}>
          Privacy
        </a>
        <a href="#" style={{ color: "var(--color-text-secondary)", textDecoration: "none" }}>
          Documentation
        </a>
      </div>
    </footer>
  );
}