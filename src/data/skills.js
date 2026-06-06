import {
  Code2,
  Server,
  Wrench,
  BookOpen,
} from "lucide-react"

export const skills = [
  {
    category: "Frontend",
    icon: Code2,
    items: [
      { name: "React",       level: "Advanced"      },
      { name: "Next.js",     level: "Intermediate"  },
      { name: "JavaScript",  level: "Advanced"      },
      { name: "TypeScript",  level: "Intermediate"  },
      { name: "Tailwind CSS",level: "Advanced"      },
      { name: "HTML5 / CSS3",level: "Advanced"      },
    ],
  },
  {
    category: "Backend",
    icon: Server,
    items: [
      { name: "Node.js",    level: "Intermediate" },
      { name: "Express.js", level: "Intermediate" },
      { name: "MongoDB",    level: "Intermediate" },
      { name: "REST APIs",  level: "Intermediate" },
    ],
  },
  {
    category: "Tools",
    icon: Wrench,
    items: [
      { name: "Git / GitHub", level: "Advanced"     },
      { name: "Vite",         level: "Advanced"     },
      { name: "Figma",        level: "Intermediate" },
      { name: "VS Code",      level: "Advanced"     },
    ],
  },
  {
    category: "Learning",
    icon: BookOpen,
    items: [
      { name: "Docker",  level: "Beginner" },
      { name: "Linux",   level: "Beginner" },
      { name: "DevOps",  level: "Beginner" },
    ],
  },
]