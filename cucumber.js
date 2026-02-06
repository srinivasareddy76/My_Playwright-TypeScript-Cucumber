




const common = [
  'tests/apps/frbsf/features/**/*.feature',
  '--require-module ts-node/register',
  '--require tests/apps/frbsf/steps/**/*.ts',
  '--require src/common/hooks.ts',
  '--format-options \'{"snippetInterface": "async-await"}\'',
  '--world-parameters \'{"foo": "bar"}\'',
  '--publish-quiet'
].join(' ');

const formats = [
  '--format progress-bar',
  '--format json:reports/cucumber-report.json',
  '--format html:reports/cucumber-report.html',
  '--format @cucumber/pretty-formatter'
].join(' ');

module.exports = {
  default: `${common} ${formats}`,
  
  // Headed mode profile
  headed: `${common} ${formats} --tags "not @skip"`,
  
  // Headless mode profile  
  headless: `${common} ${formats} --tags "not @skip"`,
  
  // Smoke tests profile
  smoke: `${common} ${formats} --tags "@smoke"`,
  
  // Critical tests profile
  critical: `${common} ${formats} --tags "@critical"`,
  
  // Homepage tests profile
  homepage: `${common} ${formats} --tags "@homepage"`,
  
  // Search tests profile
  search: `${common} ${formats} --tags "@search"`,
  
  // Research tests profile
  research: `${common} ${formats} --tags "@research"`,
  
  // News tests profile
  news: `${common} ${formats} --tags "@news"`,
  
  // Performance tests profile
  performance: `${common} ${formats} --tags "@performance"`,
  
  // Responsive tests profile
  responsive: `${common} ${formats} --tags "@responsive"`,
  
  // Mobile tests profile
  mobile: `${common} ${formats} --tags "@mobile"`,
  
  // Tablet tests profile
  tablet: `${common} ${formats} --tags "@tablet"`,
  
  // Desktop tests profile
  desktop: `${common} ${formats} --tags "@desktop"`,
  
  // Accessibility tests profile
  accessibility: `${common} ${formats} --tags "@accessibility"`,
  
  // Cross-browser tests profile
  'cross-browser': `${common} ${formats} --tags "@cross-browser"`,
  
  // Parallel execution profile
  parallel: `${common} ${formats} --parallel 3`,
  
  // Retry failed tests profile
  retry: `${common} ${formats} --retry 2`,
  
  // Debug profile with verbose output
  debug: `${common} --format progress-bar --tags "@debug"`,
  
  // CI/CD profile
  ci: `${common} --format json:reports/cucumber-report.json --format junit:reports/cucumber-junit.xml --tags "not @skip and not @manual"`,
  
  // Quick smoke test profile
  'quick-smoke': `${common} ${formats} --tags "@smoke and @critical"`,
  
  // Full regression profile
  regression: `${common} ${formats} --tags "not @skip and not @wip"`,
  
  // Work in progress profile
  wip: `${common} ${formats} --tags "@wip"`,
  
  // Manual tests profile (for documentation)
  manual: `${common} ${formats} --tags "@manual" --dry-run`,
  
  // Environment-specific profiles
  t3: `${common} ${formats} --tags "not @t5-only"`,
  t5: `${common} ${formats} --tags "not @t3-only"`,
  
  // Browser-specific profiles
  chromium: `${common} ${formats} --tags "not @firefox-only and not @webkit-only"`,
  firefox: `${common} ${formats} --tags "not @chromium-only and not @webkit-only"`,
  webkit: `${common} ${formats} --tags "not @chromium-only and not @firefox-only"`
};




