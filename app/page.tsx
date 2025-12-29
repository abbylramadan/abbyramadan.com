import { Button } from '@/components/ui/button';

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
          <h1 className='text-5xl sm:text-7xl font-bold tracking-tight'>
            Abby Ramadan
          </h1>
          <p className='text-xl sm:text-2xl text-gray-400'>
            Financial Analyst
          </p>
          <p className='text-gray-400 max-w-xl mx-auto'>
            Capital markets professional with expertise in structured finance,
            regulatory compliance, and data-driven decision making.
          </p>

          <div className='pt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-400'>
            <span>Chicago, IL</span>
            <span className='hidden sm:inline'>•</span>
            <a
              href='https://linkedin.com/in/abby-ramadan/'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-white transition-colors underline underline-offset-4'
            >
              LinkedIn
            </a>
            <span className='hidden sm:inline'>•</span>
            <a
              href='mailto:abbyramadan98@gmail.com'
              className='hover:text-white transition-colors underline underline-offset-4'
            >
              Contact
            </a>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id='experience' className='px-4 pb-20'>
        <div className='max-w-4xl mx-auto'>
          <h2 className='text-2xl font-semibold mb-8 border-b border-gray-800 pb-4'>
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
                      <span className='text-gray-600 mr-3'>-</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Education */}
          <h2 className='text-2xl font-semibold mt-16 mb-8 border-b border-gray-800 pb-4'>
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
          <h2 className='text-2xl font-semibold mt-16 mb-8 border-b border-gray-800 pb-4'>
            Skills
          </h2>
          <div className='flex flex-wrap gap-2'>
            {skills.map(skill => (
              <span
                key={skill}
                className='px-3 py-1.5 bg-gray-900 border border-gray-800 text-gray-300 text-sm rounded'
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Interests */}
          <h2 className='text-2xl font-semibold mt-16 mb-8 border-b border-gray-800 pb-4'>
            Interests
          </h2>
          <div className='flex flex-wrap gap-2'>
            {interests.map(interest => (
              <span
                key={interest}
                className='px-3 py-1.5 border border-gray-800 text-gray-400 text-sm rounded'
              >
                {interest}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className='mt-20 text-center'>
            <p className='text-gray-400 mb-6'>
              Interested in connecting?
            </p>
            <Button asChild size='lg'>
              <a href='mailto:abbyramadan98@gmail.com'>
                Get in Touch
                <span className='ml-2'>→</span>
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
