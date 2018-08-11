# Achievacity Requirements Document
## Overview
Achievacity is a web app that provides a scoring system that records generic user routines and goals.

## Navigation Patterns
- Start
  - User registers by entering his email address.
- Usage
  - User adds goals and/or routines, naming them and assigning weight, due dates, and optional descriptions.

## Features
- Records how well the user has followed her goals and/or routines and gives scores based on that success.
- Goals are one-time accomplishments. Routines are recurring accomplishments.
- Each goal/routine is rated by the user on a five-point weight scale, 1 being unimportant and 5 being very important.
- Each goal has a due date. If it is not completed by then, it is counted as incomplete. Each routine has a cyclic due date.
- Score is calculated by performing a weighted average on user's goals and routines. Each goal is valued as `1` (complete), `0.5` (partially complete), or `0` (incomplete), and each routine is marked as a percentage of how many times it was completed out of all possible completion times since last scoring.
- User can add/remove/edit goals and routines.
