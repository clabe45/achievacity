# Achievacity
Achievacity is a web app that scores individuals' success with any routines and goals in a social way.

## Who It's for
The end-product is for people who are frustrated with their goals and would like to keep them better *and* for people who are having success and just want a score put to their hard work.

## Why It Matters
I started this app because I wasn't fulfilling my plans. This app will allow others to get things done in a practical way. It will provide incentive and motivation to stick with their ideas, making their hopes reality. Who knows? It might even turn into a contest between friends to see who has done better at achieving their goals! Either way, the aim of this project is for others to be able to track and get motivated with their routines and goals.

*Plus it's open source.*

## The Concept
### Goals and Routines
This app will record how well the user has followed her goals and/or routines and give scores based on that success.

**Goals** are one-time accomplishments. **Routines** are recurring accomplishments. Each goal/routine has the following properties:
- A name
- A description
- A sentence explaining *why* it should be done
- A weight given by the user on a five-point scale, `1` being unimportant and `5` being very important
- A due date. If it is not completed by then, it is counted as incomplete. Each routine has a cyclic due date (e.g., every Monday).

### Scoring
Score is calculated by performing a weighted average on the user's goals and routines. Each goal is valued as `1` (complete), `0.5` (partially complete), or `0` (totally incomplete), and each routine is marked as a percentage of how many times it was completed out of all the times it _could_ have been completed since the last scoring.

## Development
If you would like to get involved, please check out [CONTRIBUTING.md](CONTRIBUTING.md) for guides, docs, and more! You can also join the Slack [Achievacity Team][slack]!

[slack]: https://join.slack.com/t/achievacity/shared_invite/enQtNDEyNjM2ODQ3OTIxLWVlOTYxOGNiODAwOWJmNGI3MDFlOWZlZWI5MGMxZTZjYmM4NGMzMmQyMzFjMWUzMGNkYzE0MmEyNjM3ZmQxMjA
