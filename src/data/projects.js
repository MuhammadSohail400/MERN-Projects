import nexusHR     from "../assets/images/projects/nexushr.png"
import berryfood   from "../assets/images/projects/berryfood.png"
import jobboard    from "../assets/images/projects/jobboard.png"
import restaurentpos  from "../assets/images/projects/restaurent.png"

export const projects = [
  {
    id: 1,
    title: "NexusHR Dashboard",
    description:
      "Employee Management Dashboard with full CRUD operations, Context API global state, custom hooks, and atomic folder structure.",
    tags: ["React", "Tailwind", "Context API"],
    category: "frontend",
    image: nexusHR,
    demo: "#",
    github: "#",
  },
  {
    id: 2,
    title: "BerryFood",
    description:
      "Dark luxury food delivery UI with component architecture, props patterns, and Tailwind v4 CSS-first configuration.",
    tags: ["React", "Tailwind v4"],
    category: "frontend",
    image:berryfood,
    demo: "#",
    github: "#",
  },
  {
    id: 3,
    title: "Job Board Website",
    description:
      "Full-featured job listing platform with search and filter functionality built with Next.js and Tailwind.",
    tags: ["Next.js", "React", "Tailwind"],
    category: "fullstack",
    image: jobboard,
    demo: "#",
    github: "#",
  },
  {
    id: 4,
    title: "Restaurant + Admin Dashboard",
    description:
      "Restaurant website with complete admin panel for menu management, orders, and analytics.",
    tags: ["React", "Tailwind"],
    category: "fullstack",
    image: restaurentpos,
    demo: "#",
    github: "#",
  },
]