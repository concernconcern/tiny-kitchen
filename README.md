# Tiny Kitchen

createdb tiny-kitchen and tiny-kitchen-test


secrets.js
  ```
    process.env.GOOGLE_CLIENT_ID = 'hush hush';
    process.env.GOOGLE_CLIENT_SECRET = 'pretty secret';
    process.env.GOOGLE_CALLBACK = '/auth/google/callback';
  ```

* To use OAuth with Google, complete the step above with a real client ID and client secret from Google
  * You can get them here: https://console.developers.google.com/apis/credentials
* Finally, complete the section below to set up your linter

## Start

`npm run start-dev` will make great things happen!

If you want to run the server and/or webpack separately, you can also `npm run start-server` and `npm run build-client`.

From there, just follow your bliss.

## Deployment

Ready to go world wide? Here's a guide to deployment!

### Prep
1. Set up the [Heroku command line tools](https://devcenter.heroku.com/articles/heroku-cli)
2. `heroku login`
3. Add a git remote for heroku:
  - **If you're creating a new app...**
    1. `heroku create` or `heroku create your-app-name` if you have a name in mind.
    2. `heroku addons:create heroku-postgresql:hobby-dev` to add ("provision") a postgres database to your heroku dyno

  - **If you already have a Heroku app...**
    1.  `heroku git:remote your-app-name` You'll need to be a collaborator on the app.

### When you're ready to deploy

1. Make sure that all your work is fully committed and pushed to your master branch on Github.
2. Checkout a new branch called "deploy": `git checkout -b deploy`. If you currently have an existing branch called "deploy", delete it now (`git branch -d deploy`). Note that the name "deploy" here isn't magical, but it needs to match the name of the branch we specify when we push to our heroku remote.
3. `npm run deploy` - this will cause the following commands to happen in order:
  - `webpack -p`: webpack will run in "production mode"
  - `git add -f public/bundle.js public/bundle.js/map`: "force" add the otherwise gitignored build files
  - `git commit --allow-empy -m 'Deploying'`: create a commit, even if nothing changed
  - `git push heroku deploy:master`: push your local "deploy" branch to the "master" branch on heroku

Now, you should be deployed! To clean up, remove your deploy branch:

4. `git checkout master`: return to your master branch
5. `git branch -d deploy`: remove the deploy branch

Why do all of these steps? The big reason is because we don't want our production server to be cluttered up with dev dependencies like webpack, but at the same time we don't want our development git-tracking to be cluttered with production build files like bundle.js! By doing these steps, we make sure our development and production environments both stay nice and clean!

(By the way, if performing these steps seems tedious and error-prone, try writing a shell script that will do them all for you!)

