import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center px-4">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-6xl sm:text-8xl font-bold tracking-tight gradient-text">
            Abby Ramadan
          </h1>
          <p className="text-2xl sm:text-3xl text-purple-300">
            Financial Analyst & Artist
          </p>
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          <p className="text-lg text-gray-300 leading-relaxed">
            Welcome to my digital space. I blend data science with creative expression,
            turning complex problems into elegant solutions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link
            href="/projects"
            className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-medium text-lg rounded-lg shadow-lg hover:shadow-purple-500/50"
          >
            View Projects
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link
            href="/experience"
            className="group px-8 py-4 border-2 border-purple-500 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 hover:text-white transition-all duration-300 font-medium text-lg rounded-lg"
          >
            Experience
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="pt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2 text-purple-400">5+</div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2 text-pink-400">20+</div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2 text-blue-400">3</div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">Domains</div>
          </div>
        </div>
      </div>

      {/* Featured Project Section */}
      <div className="w-full max-w-6xl py-20 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Featured <span className="gradient-text">Project</span>
          </h2>
          <p className="text-xl text-gray-400">
            Check out my latest tool for home affordability analysis
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 sm:p-12 card-glow">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex-1 space-y-6 text-left">
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full">
                  <span className="text-sm font-medium text-purple-300 uppercase tracking-wider">
                    Financial Tool
                  </span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-bold">
                  Home Affordability Calculator
                </h3>

                <p className="text-gray-300 text-lg leading-relaxed">
                  A comprehensive tool that helps you understand exactly how much home you can afford.
                  Features detailed mortgage calculations, interactive visualizations, and personalized
                  affordability analysis based on your income, debts, and financial goals.
                </p>

                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-purple-900/30 border border-purple-500/30 text-purple-300 rounded-lg text-sm font-medium">
                    React
                  </span>
                  <span className="px-4 py-2 bg-pink-900/30 border border-pink-500/30 text-pink-300 rounded-lg text-sm font-medium">
                    TypeScript
                  </span>
                  <span className="px-4 py-2 bg-blue-900/30 border border-blue-500/30 text-blue-300 rounded-lg text-sm font-medium">
                    Financial Analysis
                  </span>
                  <span className="px-4 py-2 bg-cyan-900/30 border border-cyan-500/30 text-cyan-300 rounded-lg text-sm font-medium">
                    Data Visualization
                  </span>
                </div>

                <a
                  href="https://mortgagecalc.abbyramadan.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-medium text-lg rounded-lg shadow-lg hover:shadow-purple-500/50 group"
                >
                  Launch Calculator
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>

              <div className="flex-shrink-0 lg:w-80">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl blur-2xl opacity-20"></div>
                  <div className="relative bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-xl p-8 backdrop-blur-sm">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Monthly Payment</span>
                        <span className="text-2xl font-bold text-purple-300">$2,847</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{width: '68%'}}></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                          <div className="text-xs text-gray-400 mb-1">Max Home Price</div>
                          <div className="text-lg font-bold text-pink-300">$485K</div>
                        </div>
                        <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                          <div className="text-xs text-gray-400 mb-1">Down Payment</div>
                          <div className="text-lg font-bold text-blue-300">20%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-8">
          <Link
            href="/projects"
            className="inline-flex items-center text-purple-300 hover:text-purple-200 transition-colors group text-lg"
          >
            View all projects
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}