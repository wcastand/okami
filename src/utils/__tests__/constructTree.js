import startOfWeek from 'date-fns/startOfWeek'

import {constructTree} from '../constructTree'

describe('constructTree', () => {
  test('basic case', () => {
    const events = [
      {
        allDay: false,
        start: new Date(2017, 9, 7, 3, 0, 0),
        end: new Date(2017, 9, 7, 14, 0, 0),
      },
      {
        allDay: false,
        start: new Date(2017, 9, 7, 5, 0, 0),
        end: new Date(2017, 9, 7, 7, 0, 0),
      },
      {
        allDay: false,
        start: new Date(2017, 9, 7, 12, 30, 0),
        end: new Date(2017, 9, 7, 13, 30, 0),
      },
      {
        allDay: false,
        start: new Date(2017, 9, 7, 13, 0, 0),
        end: new Date(2017, 9, 7, 14, 30, 0),
      },
      {
        allDay: false,
        start: new Date(2017, 9, 7, 16, 30, 0),
        end: new Date(2017, 9, 7, 18, 0, 0),
      },
      {
        allDay: false,
        start: new Date(2017, 9, 7, 17, 0, 0),
        end: new Date(2017, 9, 7, 18, 30, 0),
      },
      {
        allDay: false,
        start: new Date(2017, 9, 7, 17, 0, 0),
        end: new Date(2017, 9, 7, 17, 30, 0),
      },
    ]
    const nodes = {
      0: {level: 0, children: [1, 2, 3], depth: 3},
      1: {level: 1, children: [], depth: 3},
      2: {level: 1, children: [3], depth: 3},
      3: {level: 2, children: [], depth: 3},
      4: {level: 0, children: [5, 6], depth: 2},
      5: {level: 1, children: [], depth: 2},
      6: {level: 1, children: [], depth: 2},
    }
    expect(constructTree(events)).toEqual(nodes)
  })
  test('with twice the same event', () => {
    const events = [
      {
        id: 0,
        allDay: false,
        start: new Date(2017, 9, 7, 13, 0, 0),
        end: new Date(2017, 9, 7, 14, 30, 0),
      },
      {
        id: 1,
        allDay: false,
        start: new Date(2017, 9, 7, 13, 0, 0),
        end: new Date(2017, 9, 7, 14, 30, 0),
      },
    ]
    expect(constructTree(events)).toEqual({
      0: {level: 0, children: [1], depth: 2},
      1: {level: 1, children: [], depth: 2},
    })
  })
  test('subsequent children, 2 child of 1, 3 child of 2 but not of 1', () => {
    const events = [
      {
        id: '1',
        allDay: false,
        start: '2018-01-26T07:30:00.000Z',
        end: '2018-01-26T08:30:00.000Z',
      },
      {
        id: '2',
        allDay: false,
        start: '2018-01-26T08:00:00.000Z',
        end: '2018-01-26T11:00:00.000Z',
      },
      {
        id: '3',
        allDay: false,
        start: '2018-01-26T09:00:00.000Z',
        end: '2018-01-26T09:30:00.000Z',
      },
    ]
    expect(constructTree(events)).toEqual({
      '0': {children: [1], depth: 3, level: 0},
      '1': {children: [2], depth: 3, level: 1},
      '2': {children: [], depth: 3, level: 2},
    })
  })
})
