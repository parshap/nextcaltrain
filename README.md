# caltrain-schedule

## Command Line Usage

```
$ nextcaltrain ctsf ctsmat
```

# Notes

1. Search `store.calendar` for *services* matching the current date.
1. Search for *trips* that have a matching `service_id`
1. Search for *stop times* that match the trip's `trip_id`
1. Search for *stops* that match the stop times's `stop_id`
1. If the stop has a *parent station*, search for the parent stop

## Stops at station sorted by time

```
main: (stops) ->
  stop times = Search `store.stopTimes` for `stop_id`
  sort stop times by departure_time
  for each stop time (starting with first after current time)
    service = find service (stop time)
    if service is active today
    return service

find service: (stop time) ->
  trip = get stop time's trip
  service = get trip's service
  return service
