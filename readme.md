# Basic React Boilerplate

Simple minimalistic React boilerplate app, that hopefully can make your development easier

## Features

React v17<br>
Webpack 5<br>
SCSS<br>
Jest/React Testing Library<br>
Axios & React-Query<br>
PropTypes<br>
ESLint & Prettier<br>
Husky for Pre-commit lint&formatting of changed files<br>
SEO support through Helmet<br>
Continous Integration - GitHub Action<br>
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

### In plans

- Formik

### Maybe?

- Styled components
- Material UI
- React DnD

## Questions

- Q: Why no Redux?

  A: Too much boilercode, hard to maintain and slow to code. Rather use React-Query, which fetches, parses, caches data for you. Or in case if you need global storage for your app, React Context will probably do fine , but in huge apps where global state changes frequently - Redux is probably better option
