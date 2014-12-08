# nextcaltrain

Find the next Caltrain

## CLI Usage

```
SYNOPSIS
      nextcaltrain [OPTIONS] FROM TO

DESCRIPTION
      nextcaltrain prints the schedule of the next Caltrain from the
      FROM station to the TO station.

OPTIONS

      --number NUMBER, -n NUMBER
          Show NUMBER of possible trips. Default is 1.

EXAMPLES
  nextcaltrain sf sunnyvale
  nextcaltrain -n 5 "san fran" "san mateo"
```
