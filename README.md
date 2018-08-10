# Achievacity
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fclabe45%2Fachievacity.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fclabe45%2Fachievacity?ref=badge_shield)

Achievacity is a web app that scores user success with generic routines and goals.

## The Concept
### Goals and Routines
This app will record how well the user has followed her goals and/or routines and give scores based on that success.

**Goals** are one-time accomplishments. **Routines** are recurring accomplishments. Each goal/routine has the following properties:
- Weight given by the user on a five-point scale, `1` being unimportant and `5` being very important.
- A due date. If it is not completed by then, it is counted as incomplete. Each routine has a cyclic due date (e.g., every Monday).

### Scoring
Score is calculated by performing a weighted average on the user's goals and routines. Each goal is valued as `1` (complete), `0.5` (partially complete), or `0` (incomplete), and each routine is marked as a percentage of how many times it was completed out of all the times it _could_ have been completed since the last scoring.

## Development
This project is hot off the press (and very much a work in progress)! If you would like to get involved, please check out [its future](.dev) and [CONTRIBUTING.md](CONTRIBUTING.md)! You can also join the Slack [Achievacity Team](https://join.slack.com/t/achievacity/shared_invite/enQtNDEyNjM2ODQ3OTIxLWVlOTYxOGNiODAwOWJmNGI3MDFlOWZlZWI5MGMxZTZjYmM4NGMzMmQyMzFjMWUzMGNkYzE0MmEyNjM3ZmQxMjA)!


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fclabe45%2Fachievacity.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fclabe45%2Fachievacity?ref=badge_large)