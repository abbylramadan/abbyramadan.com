const projects = [
  {
    id: 1,
    title: "Home Affordability Calculator",
    description: "A comprehensive financial tool that helps users determine how much home they can afford. Features detailed mortgage calculations, interactive visualizations, and personalized affordability analysis.",
    technologies: ["React", "TypeScript", "Chart.js", "Tailwind CSS"],
    category: "Financial Tool",
    link: "https://mortgagecalc.abbyramadan.com",
    featured: true,
    gradient: "from-purple-500 to-pink-500"
  }
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold">
            My <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Building tools that solve real problems and make complex topics accessible
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 card-glow h-full flex flex-col">
                <div className="mb-4">
                  <span className={`inline-block px-4 py-2 bg-gradient-to-r ${project.gradient || 'from-purple-500/20 to-pink-500/20'} border border-purple-500/30 rounded-full text-xs uppercase tracking-wider font-medium text-purple-300`}>
                    {project.category}
                  </span>
                </div>

                <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-300 transition-colors">
                  {project.title}
                </h3>

                <p className="text-gray-300 mb-6 text-base leading-relaxed flex-grow">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, idx) => {
                    const colors = [
                      'bg-purple-900/30 border-purple-500/30 text-purple-300',
                      'bg-pink-900/30 border-pink-500/30 text-pink-300',
                      'bg-blue-900/30 border-blue-500/30 text-blue-300',
                      'bg-cyan-900/30 border-cyan-500/30 text-cyan-300'
                    ];
                    return (
                      <span
                        key={tech}
                        className={`px-3 py-1.5 border rounded-lg text-xs font-medium ${colors[idx % colors.length]}`}
                      >
                        {tech}
                      </span>
                    );
                  })}
                </div>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-medium rounded-lg shadow-lg hover:shadow-purple-500/50 group justify-center"
                >
                  Launch Project
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center space-y-6">
          <p className="text-gray-300 text-lg">
            More projects coming soon! Follow along on GitHub
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 border-2 border-purple-500 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 hover:text-white transition-all duration-300 font-medium rounded-lg group"
          >
            View GitHub
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}