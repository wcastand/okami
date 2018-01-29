import {asHours} from 'pomeranian-durations'
import getMinutes from 'date-fns/fp/getMinutes'
import getHours from 'date-fns/fp/getHours'
import isBefore from 'date-fns/fp/isBefore'
import setHours from 'date-fns/fp/setHours'
import isAfter from 'date-fns/fp/isAfter'
import endOfDay from 'date-fns/fp/endOfDay'
import startOfDay from 'date-fns/fp/startOfDay'

import {around} from './around'

// Gives the absolute positioning of the events
export function placeEvents(renderableIndexes, nodes, events, rowHeight, startHour, endHour, day) {
  const sh = asHours(startHour)
  const eh = asHours(endHour)
  const hoursToMinutes = entry => around((getHours(entry) - sh) * 60) + getMinutes(entry)

  const endCurrentDay = endOfDay(day)
  const startCurrentDay = startOfDay(day)

  return renderableIndexes.map(i => {
    const {start, end} = events[i]
    const {level, depth, children} = nodes[i]
    const ratio = 100 / depth

    // The event might starts before the start of the rendered day. In this case, we consider that
    // the event starts at the beginning of the day
    const inDayStart = isBefore(startCurrentDay, start) ? startCurrentDay : start
    const inDayEnd = isAfter(endCurrentDay, end) ? endCurrentDay : end

    const boundedStart = isBefore(setHours(sh, inDayStart), inDayStart)
      ? 0
      : hoursToMinutes(inDayStart)
    const boundedEnd = isAfter(setHours(eh, inDayEnd), inDayEnd)
      ? around((eh - sh) * 60)
      : hoursToMinutes(inDayEnd)

    return {
      key: i,
      event: events[i],
      style: {
        position: 'absolute',
        top: rowHeight * around(boundedStart / 60),
        left: `${level * ratio}%`,
        width: children.length === 0 ? `${100 - level * ratio}%` : `${ratio + 0.7 * ratio}%`,
        height: rowHeight * around((boundedEnd - boundedStart) / 60),
      },
    }
  })
}
