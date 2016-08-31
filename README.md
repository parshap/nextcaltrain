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

### Example

```
$ nextcaltrain sf smat
From: San Francisco
To:   San Mateo

12:07pm – 12:40pm
SB 146 Local, 33 min, 7 stops
 > 12:07pm San Francisco
 > 12:12pm 22nd Street
 > 12:17pm Bayshore
 > 12:23pm So. San Francisco
 > 12:27pm San Bruno
 > 12:31pm Millbrae
 > 12:35pm Burlingame
 > 12:40pm San Mateo
```

## Data

Schedule data [is provided by Caltrain][schedule data] in the [GTFS][]
format. This data is stored in its original format in the `data/`
directory and also as JSON in `data.json`. This data can be updated
using the `update-data` script.

[schedule data]: http://www.caltrain.com/developer.html
[gtfs]: https://developers.google.com/transit/gtfs/

## See Also

 * http://nextcaltrain.com

## Installation

```
npm install nextcaltrain
```
