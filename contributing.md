# Contributing

Hello! It's great that you are interested in contributing to my blog.

Before submitting your contribution, please take a moment to read the following guide.

## Local Development

This project uses the [pnpm](https://pnpm.io) package manager. Therefore, to work with the project, you need to install it.

How to set up a project locally:

1. Clone repo:

```sh
git clone git@github.com:azat-io/azat-io.git
```

2. Install dependencies:

```sh
pnpm install
```

3. Run local server:

```sh
pnpm start
```

## Content Translation

It is my great pleasure to welcome you if you have a desire to help translate my blog articles into your language.

To start translating an article, you need to copy the file with the original article in English. All articles are located in the `content/blog/en/` directory. Create a folder in the `content/blog/` folder with the two-digit [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) code of your language and place the article file with the same name there.

For example, you want to translate the article `/content/blog/en/hello-world.md` into Chinese. Copy this file to the `/content/blog/zh/hello-world.md`.

As a thank you, I will cite you as the author of the translation in the article.

If you have any questions, feel free to create [issue](https://github.com/azat-io/azat-io/issues) or message me on social media.

## Pull Request Guidelines

Before create pull request fork this repo and create a new branch.

Commit messages must follow the [commit message convention](https://conventionalcommits.org) so that changelogs can be automatically generated.

Make sure tests pass.
