# Basic React Boilerplate

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

## Questions

- Q: Why no Redux?

  A: Too much boilercode, hard to maintain and slow to code. Rather use React-Query, which fetches, parses, caches data for you. Or in case if need global storage for your app, React Context will probably do fine , but in huge apps where global state changes frequently - Redux is probably better option
