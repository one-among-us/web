#!/usr/bin/env python3
#
# This is a simple script I made to move commits into the future
#
# You might wonder why: On the day Jan 6 of 2023, I worked too hard and pushed 120 commits to GitHub. It feels nice to
# code, but also with 120 commits in one day, all other days on my GitHub's green wall with < 30 commits are dimmed to
# the literally invisible color. So I decided to make this script to artificially spread things out a bit.
#
# -- Azalea

import argparse
import os
import shlex
from pathlib import Path
from subprocess import check_call

if __name__ == '__main__':
    parser = argparse.ArgumentParser("Git Future: A simple script to push things to the future")
    parser.add_argument("commits", type=int, help="How many commits do you want to change?")
    parser.add_argument("time", type=int, help="How many hours into the future do you want to push?")
    args = parser.parse_args()

    # Create environment variables
    env = os.environ.copy()
    env['dt'] = str(args.time)
    env['commits'] = str(args.commits)

    # Find helper
    helper = Path(__file__).parent / "git_future_helper.py"

    # Execute git command
    cmd = f'git -c rebase.instructionFormat="%aI" -c sequence.editor="{helper}" rebase -i "HEAD~{args.commits}"'
    print(cmd)
    assert input("Execute? [y/N]") == 'y'

    check_call(shlex.split(cmd), env=env)

