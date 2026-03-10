/**
 * Prettier 설정
 * 
 * @see https://prettier.io/docs/en/configuration.html
 */

/** @type {import("prettier").Config} */
const config = {
  // 기본 설정
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  
  // JSX 설정
  jsxSingleQuote: false,
  
  // 후행 쉼표
  trailingComma: 'es5',
  
  // 괄호 설정
  bracketSpacing: true,
  bracketSameLine: false,
  
  // 화살표 함수 괄호
  arrowParens: 'always',
  
  // 줄바꿈
  endOfLine: 'lf',
  
  // 파일 형식별 설정
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 200,
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'preserve',
      },
    },
  ],
};

export default config;

