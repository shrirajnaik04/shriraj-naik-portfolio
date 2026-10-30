import type { Award, Profile } from './types'

export const profile: Profile = {
  name: 'Shriraj Naik',
  headline: 'QA Automation Engineer & AI Product Engineer',
  location: 'Goa, India',
  email: 'nykshriraj4nov@gmail.com',
  phone: '+91 9764904641',
  links: {
    site: 'https://www.shrirajnaik.com',
    linkedin: 'https://www.linkedin.com/in/shriraj-naik-494421154/',
    github: 'https://github.com/shrirajnaik04',
  },
  portrait: {
    src: 'v1777649066/profile.jpg',
    alt: 'Portrait of Shriraj Naik',
  },
  hero: {
    subtitle: 'QA Automation Engineer & AI Product Engineer in Goa, India',
    statement:
      'I test FinTech software for a living and build AI products end to end, with one rule for both: it isn’t done until it’s tested.',
    body: 'Four years of test automation, API testing and release quality on financial systems. Outside of it, I design, build and run full-stack products, including Gym Daddy, a multi-tenant SaaS for gyms that’s in production today.',
  },
  facts: [
    { value: '4+ yrs', label: 'QA in FinTech' },
    { value: '1,000+', label: 'automated test cases' },
    { value: '1,000+', label: 'API validations' },
    { value: 'Q3 2024', label: 'Spotlight Award, Quality Analyst of the Quarter' },
    { value: '1', label: 'SaaS in production' },
  ],
  about: {
    intro:
      'I came to software through the support desk: hardware, software and network support for Indian Coast Guard operations at INS Hansa, then a year in finance at Muthoot Finance, before moving into QA in 2022. That path is why I test like an end user and read code like a developer.',
    outro:
      'That’s how I work. I use AI tools such as Claude Code every day, and I don’t ship what I can’t test or explain.',
  },
  vibeDefinition:
    'vibe engineer (n.) — an engineer who builds with AI assistants and stays accountable for everything they produce: architecture, security, tests, performance and running cost. The assistant drafts; the engineer decides, verifies and signs off.',
}

export const award: Award = {
  title: 'Spotlight Award of the Quarter',
  period: 'Jul – Sep 2024',
  note: 'Recognized as Quality Analyst of the Quarter for contributions and impact in QA automation.',
}
