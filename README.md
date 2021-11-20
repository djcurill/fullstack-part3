# Online Phonebook

This codebase is apart of the fullstackopen curriculum offered by the University of Helsinki. In this exercise we work on deploying a working frontend and backend to the internet using Heroku's web services. The website is hosted [here](stormy-woodland-12282.herokuapp.com).

## Getting setup

---

To deploy this app, you first need to be setup with heroku. Work through their [intro docs](https://devcenter.heroku.com/articles/getting-started-with-nodejs) to learn how to deploy an app.

## Deploying to the Internet

---

To run the web service run the following commands:

```bash
$ heroku ps:scale web=1
$ heroku restart
$ heroku open
```

## Running locally

The website is also able to run locally by running the command `npm run dev`.
