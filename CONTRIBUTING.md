# Contributing to Achievacity
**Welcome.** Thank you for showing your interest in Achievacity! We're glad you're here! Any kind of contribution is welcome.

## Environment
Due to the project's dependency UserSpice, the setup process is a little complex.
### Download UserSpice (currently v4)
- Navigate to your localhost www directory

1. `wget https://github.com/mudmin/UserSpice4/archive/master.zip`
2. `unzip master.zip`
3. `rm master.zip`
4. `mv UserSpice4-master achievacity`
5. `cd achievacity`

*or*

- Download from https://userspice.com/, and extract to an empty directory `achievacity`.

### Install UserSpice
1. Start localhost server, if necessary.
2. `CREATE DATABASE achievacity`
3. Open `index.php` and follow install instructions. (For Step 2, enter your database host, username, and password; and enter `achievacity` for the database name.)

### Clean up
- `rm -r install`

### Initialize Git
1. Fork this repo.
2. `git init`
3. `git remote add origin PATH/TO/FORK`
4. gitignore everything: `/*`

## Getting changes
- Instead of pulling, perform a hard reset: `git reset --hard origin/master`. That way the unchanged, gitignored files will be preserved.

## Submitting Changes
1. Un-gitignore the modified file(s), by prefixing the path(s) with `!`. **Note: only add files that were previously added or that you modified.**
2. Stage and commit modified file(s). If you can find an appropriate [GitHub emoji](https://gitmoji.carloscuesta.me/), prepend you message with that.
3. `git push origin master`
4. Submit a pull request on your fork.

## Styleguide
1. Write clean code. [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). Stay consistent to the project style:
```
if (true) {

}
```

opposed to

```
if (true)
{

}
```

2. Leave comments where another developer would ask a question.

## Additional Notes
If you have any questions or just want to communicate more, join our [Slack team](https://join.slack.com/t/achievacity/shared_invite/enQtNDEyNjM2ODQ3OTIxLWVlOTYxOGNiODAwOWJmNGI3MDFlOWZlZWI5MGMxZTZjYmM4NGMzMmQyMzFjMWUzMGNkYzE0MmEyNjM3ZmQxMjA)!
