#!/usr/bin/env python3

import datetime
import os
import sys
from pathlib import Path

if __name__ == '__main__':
    # git -c rebase.instructionFormat="%aI" -c sequence.editor="tools/git_future.py" rebase -i HEAD~2

    # commits: How many commits do you want to edit
    commits = int(os.environ['commits'])

    # dt (delta-time): How many hours do you want to shift the commits by
    dt = datetime.timedelta(hours=int(os.environ['dt']))
    print(f"\nUsing dt = {dt}")

    # Parse rebase file
    rebase_file = Path(sys.argv[1])
    lines = [l for l in rebase_file.read_text().split("\n") if l.startswith("pick")]
    print(f"\nRebase file path = {rebase_file}")
    print("ORIGINAL REBASE FILE CONTENT: ")
    print('\n'.join(lines))
    print(f"Total amount of commits: {len(lines)}")
    assert input("Continue? [y/N]") == 'y'

    # Edit datetime
    new = lines[:-commits]
    for l in lines[-commits:]:
        date = datetime.datetime.fromisoformat(l.split(" ")[2].strip()) + dt
        new += [l, f"exec git commit --amend --no-edit --date {date.isoformat()}"]
    new = '\n'.join(new)

    print("\nEDITED REBASE FILE:")
    print(new)
    assert input("Execute? [y/N]") == 'y'

    rebase_file.write_text(new)
