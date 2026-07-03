const SectionTitle = ({ label, highlight }) => {
  return (
    <h2 className="font-syne text-3xl md:text-4xl font-bold mb-2">
      {label}{" "}
      <span className="text-cyan">{highlight}</span>
    </h2>
  )
}

export default SectionTitle