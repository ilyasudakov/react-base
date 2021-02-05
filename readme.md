# React-Base

Simple React boilerplate, that will make your development easier and faster.

Easy setup process with option to choose between JavaScript / TypeScript, best libraries for most use cases, and ability to easily change configurations

## Features

React v17<br>
Webpack 5<br>
SCSS<br>
Jest/React Testing Library<br>
Axios & React-Query<br>
Formik<br>
Styled-components<br>
ESLint & Prettier<br>
Husky for Pre-commit lint&formatting of changed files<br>
SEO support through Helmet<br>
Continous Integration - GitHub Action<br>
PropTypes<br>
Env Files<br>

## Setup

1. Run `git clone https://github.com/ilyasudakov/basic-react-boilerplate.git <YOUR_PROJECT_NAME>` to clone repository<br>

2. Change working directory to your project directory `cd <YOUR_PROJECT_NAME>`<br>

3. Run `npm run setup` to initiate setup process, where you can create new repo if you want to<br>

4. Then you can `npm run start` to view template app

## Commands

Run `npm i` to install all dependencies<br>
Run `npm run dev` to run app in development mode<br>
Run `npm run start` to serve files to `/public` folder<br>
Run `npm run test` to run tests<br>

You can run commands bellow manually, or they will run automatically with pre-commit hook(included in the app already!):

`npm run lint` to run ESLint<br>
`npm run format` to run Prettier formatter<br>

## Future Features

### In Testing

- TypeScript

### In Plans

- ...

### Maybe?

- React DnD
- Some Animation library
- Material UI

## Questions

- Q: Why no Redux?

  A: Too much boilercode, hard to maintain and slow to code. Rather use React-Query, which fetches, parses, caches data for you. Or in case if you need global storage for your app, React Context will probably do fine , but in huge apps where global state changes frequently - Redux is probably better option

- Q: Why use this exact boilerplate?

  A: This is perfect barebones boilerplate i wanted in my development, which could be helpful for you. Its pretty much just a skeleton, so you can build up your own structure and project. I hope this project gives pretty quick start to code stuff

## Quick How-to

- ### Inline SVG
  This project supports inline SVGs, to in order to use it in the app, you have to import SVG first: `import Star from './star.svg'`, then use it like this: `<Star className="my-svg" />`
