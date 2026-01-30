const experiences = [
  {
    id: 1,
    role: 'Capital Markets Associate',
    company: 'Above Lending',
    location: 'Chicago, IL',
    period: 'January 2025 - Present',
    achievements: [
      'Streamlined reporting processes by consolidating redundant workbooks and improving SQL code clarity, reducing reporting prep time by 30%',
      'Visualized loss curves and forecasted monthly vintage performance for $100MM+ loan portfolios to inform internal decision-making',
      'Interpreted credit agreements and corrected report logic, creating $500,000 in leverage at company credit facility',
      'Enhanced loan allocation tools and aligned processes with legal documents to ensure regulatory compliance',
      'Collaborated cross-functionally to support strategic initiatives across Capital Markets and other teams',
    ],
  },
  {
    id: 2,
    role: 'Structured Finance Analyst',
    company: 'Golub Capital',
    location: 'Chicago, IL',
    period: 'September 2022 - December 2024',
    achievements: [
      'Monitored and analyzed 10+ multi-million dollar asset-backed securities to ensure compliance with covenants',
      'Proposed trades of underlying assets to structured products after modeling forecasted performance and risks',
      'Advised external teams on compliance by interpreting governing indentures and applicable laws',
      'Negotiated terms with rating agencies and presented financial data to bolster our position',
    ],
  },
  {
    id: 3,
    role: 'Examiner',
    company: 'CME Group',
    location: 'Chicago, IL',
    period: 'January 2022 - September 2022',
    achievements: [
      'Reconciled firm-produced and third-party documentation to confirm accuracy of financial statements',
      'Organized and disseminated information regarding examinations and abided by CFTC regulations',
      'Assisted in testing judgmentally selected samples and researching regulations as part of examination team',
    ],
  },
  {
    id: 4,
    role: 'Examiner Intern',
    company: 'CME Group',
    location: 'Chicago, IL',
    period: 'May 2021 - July 2021',
    achievements: [
      'Prepared workpapers for examinations under guidance of senior examiners',
      'Researched relevant CFTC rules for FCMs to support examinations',
      'Participated in educational events about CME Group\'s marketing, trading, legal, and other corporate functions',
    ],
  },
  {
    id: 5,
    role: 'Regional Tax Intern',
    company: 'EY',
    location: 'Chicago, IL',
    period: 'January 2020 - March 2020',
    achievements: [
      'Fulfilled client needs by documenting international tax rules to provide Global Compliance & Reporting tax team',
      'Prepared and organized client workpapers and performed substantive analytical procedures',
      'Received training regarding corporate tax return preparation and computation of tax liability for different entities',
    ],
  },
  {
    id: 6,
    role: 'Accounting Intern',
    company: "R.J. O'Brien & Associates LLC",
    location: 'Chicago, IL',
    period: 'June 2019 - August 2019',
    achievements: [
      'Monitored internal controls and utilized XML schema to streamline reporting of monthly regulatory reports',
      'Created and analyzed rolling charts in Excel for tracking trends of account balances and ratios',
    ],
  },
];

const skills = [
  'Excel',
  'R',
  'Python',
  'Java',
  'Tableau',
  'PowerBI',
  'Power Automate',
  'Data Analysis',
];

const interests = [
  'Illustration',
  'Animation',
  'Flute',
  'Volunteering',
  'Running',
];

export default function Home() {
  return (
    <div className='w-full'>
      {/* Hero Section */}
      <section
        id='home'
        className='flex flex-col items-center justify-center min-h-[100vh] px-4'
      >
        <div className='max-w-3xl w-full flex flex-col gap-6 text-center'>
          <h1 className='text-5xl sm:text-7xl font-bold tracking-tight gradient-text'>
            Abby Ramadan
          </h1>
          <p className='text-xl sm:text-2xl text-purple-300'>
            Financial Analyst & Artist
          </p>
          <p className='text-gray-300 max-w-xl mx-auto'>
            Capital markets professional with expertise in structured finance,
            regulatory compliance, and data-driven decision making.
          </p>

          <div className='pt-8 flex flex-wrap justify-center gap-4 text-sm'>
            <span className="text-gray-400">Chicago, IL</span>
            <span className='hidden sm:inline text-gray-600'>•</span>
            <a
              href='https://linkedin.com/in/abby-ramadan/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-purple-300 hover:text-purple-200 transition-colors underline underline-offset-4'
            >
              LinkedIn
            </a>
            <span className='hidden sm:inline text-gray-600'>•</span>
            <a
              href='mailto:abbyramadan98@gmail.com'
              className='text-purple-300 hover:text-purple-200 transition-colors underline underline-offset-4'
            >
              Contact
            </a>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id='projects' className='px-4 py-20'>
        <div className='max-w-6xl mx-auto'>
          <div className="mb-16 text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold">
              Featured <span className="gradient-text">Project</span>
            </h2>
            <p className="text-xl text-gray-300">
              Check out my home affordability analysis tool
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
        </div>
      </section>

      {/* Experience Section */}
      <section id='experience' className='px-4 pb-20'>
        <div className='max-w-4xl mx-auto'>
          <h2 className='text-2xl font-semibold mb-8 border-b border-purple-900/30 pb-4'>
            Experience
          </h2>
          <div className='flex flex-col gap-10'>
            {experiences.map(exp => (
              <div key={exp.id}>
                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-3'>
                  <div>
                    <h3 className='text-lg font-semibold'>{exp.role}</h3>
                    <p className='text-gray-400'>{exp.company}</p>
                  </div>
                  <p className='text-sm text-gray-500'>{exp.period}</p>
                </div>
                <ul className='flex flex-col gap-2 text-sm text-gray-300'>
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className='flex items-start'>
                      <span className='text-purple-500 mr-3'>-</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Education */}
          <h2 className='text-2xl font-semibold mt-16 mb-8 border-b border-purple-900/30 pb-4'>
            Education
          </h2>
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1'>
              <div>
                <h3 className='text-lg font-semibold'>Master of Accountancy</h3>
                <p className='text-gray-400'>Case Western Reserve University</p>
              </div>
              <p className='text-sm text-gray-500'>January 2021 - December 2021</p>
            </div>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1'>
              <div>
                <h3 className='text-lg font-semibold'>
                  Bachelor of Science in Accounting
                </h3>
                <p className='text-gray-400'>
                  Case Western Reserve University
                  <span className='text-gray-500'> — Applied Data Science Minor</span>
                </p>
              </div>
              <p className='text-sm text-gray-500'>August 2017 - December 2021</p>
            </div>
          </div>

          {/* Skills */}
          <h2 className='text-2xl font-semibold mt-16 mb-8 border-b border-purple-900/30 pb-4'>
            Skills
          </h2>
          <div className='flex flex-wrap gap-2'>
            {skills.map((skill, idx) => {
              const colors = [
                'bg-purple-900/30 border-purple-500/30 text-purple-300',
                'bg-pink-900/30 border-pink-500/30 text-pink-300',
                'bg-blue-900/30 border-blue-500/30 text-blue-300',
                'bg-cyan-900/30 border-cyan-500/30 text-cyan-300'
              ];
              return (
                <span
                  key={skill}
                  className={`px-3 py-1.5 border rounded-lg text-sm font-medium ${colors[idx % colors.length]}`}
                >
                  {skill}
                </span>
              );
            })}
          </div>

          {/* Interests */}
          <h2 className='text-2xl font-semibold mt-16 mb-8 border-b border-purple-900/30 pb-4'>
            Interests
          </h2>
          <div className='flex flex-wrap gap-2'>
            {interests.map(interest => (
              <span
                key={interest}
                className='px-3 py-1.5 border border-purple-500/30 bg-purple-900/10 text-purple-300 text-sm rounded-lg'
              >
                {interest}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className='mt-20 text-center'>
            <p className='text-gray-300 mb-6 text-lg'>
              Interested in connecting?
            </p>
            <a
              href='mailto:abbyramadan98@gmail.com'
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-medium text-lg rounded-lg shadow-lg hover:shadow-purple-500/50 group"
            >
              Get in Touch
              <span className='ml-2 group-hover:translate-x-1 transition-transform'>→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
