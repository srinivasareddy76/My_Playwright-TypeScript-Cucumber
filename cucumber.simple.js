module.exports = {
  default: {
    paths: [
      'tests/ui-e2e/app1/features',
      'tests/ui-e2e/app2/features', 
      'tests/ui-e2e/frbsf/features',
      'tests/api/features'
    ],
    require: [
      'tests/ui-e2e/app1/step-definitions/**/*.ts',
      'tests/ui-e2e/app2/step-definitions/**/*.ts',
      'tests/ui-e2e/frbsf/step-definitions/**/*.ts',
      'tests/api/step-definitions/**/*.ts',
      'core/hooks/**/*.ts'
    ],
    requireModule: [
      'ts-node/register',
      'tsconfig-paths/register'
    ],
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json'
    ],
    parallel: 1,
    retry: 1
  }
};
