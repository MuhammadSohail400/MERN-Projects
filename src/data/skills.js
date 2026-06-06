import { Code2, Server, Wrench, BookOpen } from "lucide-react"

export const skills = [
  {
    category: "Frontend",
    icon: Code2,
    items: [
      { name: "React",        level: "Advanced",     percent: 90 },
      { name: "Next.js",      level: "Intermediate", percent: 70 },
      { name: "JavaScript",   level: "Advanced",     percent: 88 },
      { name: "TypeScript",   level: "Intermediate", percent: 65 },
      { name: "Tailwind CSS", level: "Advanced",     percent: 92 },
      { name: "HTML5 / CSS3", level: "Advanced",     percent: 95 },
    ],
  },
  {
    category: "Backend",
    icon: Server,
    items: [
      { name: "Node.js",    level: "Intermediate", percent: 65 },
      { name: "Express.js", level: "Intermediate", percent: 62 },
      { name: "MongoDB",    level: "Intermediate", percent: 60 },
      { name: "REST APIs",  level: "Intermediate", percent: 70 },
    ],
  },
  {
    category: "Tools",
    icon: Wrench,
    items: [
      { name: "Git / GitHub", level: "Advanced",     percent: 85 },
      { name: "Vite",         level: "Advanced",     percent: 88 },
      { name: "Figma",        level: "Intermediate", percent: 60 },
      { name: "VS Code",      level: "Advanced",     percent: 95 },
    ],
  },
  {
    category: "Learning",
    icon: BookOpen,
    items: [
      { name: "Docker", level: "Beginner", percent: 25 },
      { name: "Linux",  level: "Beginner", percent: 30 },
      { name: "DevOps", level: "Beginner", percent: 20 },
    ],
  },
]