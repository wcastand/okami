import React from 'react'
import Enzyme, {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import toJson from 'enzyme-to-json'
import frLocale from 'date-fns/locale/fr'
import {format} from 'date-fns'

import DailyCalendar from '../../components/daily'
import WeeklyCalendar from '../../components/weekly'
import MonthlyCalendar from '../../components/monthly'

Enzyme.configure({adapter: new Adapter()})

describe('MonthlyCalendar', () => {
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
  const fevents = [
    {
      allDay: true,
      start: new Date(2017, 9, 7, 17, 0, 0),
      end: new Date(2017, 9, 8, 17, 30, 0),
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

  const ctx = {
    events,
    fevents,
    nodes,
    locale: frLocale,
    dateFormat: 'DD',
    hourFormat: 'HH',
    matrix: [],
    type: 'daily',
    endHour: 'PT22H',
    startHour: 'PT06H',
    rowHeight: 30,
    startingDay: 1,
  }
  test('render', () => {
    const tree = mount(
      <MonthlyCalendar start={new Date(2017, 9, 9, 0, 0, 0)}>
        {({calendar}) => (
          <div>
            {calendar.map((startWeek, idx) => (
              <WeeklyCalendar key={`weekly_${idx}`} start={startWeek}>
                {({calendar: weekly}) => (
                  <div>
                    {weekly.map((day, idx) => (
                      <DailyCalendar key={`daily_cal_${idx}`} start={day} dateFormat="DD">
                        {() => <div />}
                      </DailyCalendar>
                    ))}
                  </div>
                )}
              </WeeklyCalendar>
            ))}
          </div>
        )}
      </MonthlyCalendar>,
      {
        context: ctx,
      }
    )
    expect(toJson(tree)).toMatchSnapshot()
  })
  test('next Month', () => {
    const tree = mount(
      <MonthlyCalendar start={new Date(2017, 9, 9, 0, 0, 0, 0)}>
        {({nextMonth, dateLabel}) => <span onClick={nextMonth}>{dateLabel()}</span>}
      </MonthlyCalendar>,
      {
        context: ctx,
      }
    )
    expect(tree.find('span').html()).toBe('<span>octobre</span>')
    tree.find('span').simulate('click')
    expect(tree.find('span').html()).toBe('<span>novembre</span>')
  })
  test('prev Month', () => {
    const tree = mount(
      <MonthlyCalendar start={new Date(2017, 9, 9, 0, 0, 0, 0)}>
        {({prevMonth, dateLabel}) => <span onClick={prevMonth}>{dateLabel()}</span>}
      </MonthlyCalendar>,
      {
        context: ctx,
      }
    )
    expect(tree.find('span').html()).toBe('<span>octobre</span>')
    tree.find('span').simulate('click')
    expect(tree.find('span').html()).toBe('<span>septembre</span>')
  })
  test('gotoToday Month', () => {
    const currentMonth = format(new Date(), 'MMMM', {locale: frLocale})
    const tree = mount(
      <MonthlyCalendar start={new Date(2017, 9, 9, 0, 0, 0, 0)}>
        {({gotoToday, prevMonth, dateLabel}) => (
          <div>
            <button onClick={gotoToday}>Hlo</button>
            <span onClick={prevMonth}>{dateLabel()}</span>
          </div>
        )}
      </MonthlyCalendar>,
      {
        context: ctx,
      }
    )
    expect(tree.find('span').html()).toBe('<span>octobre</span>')
    tree.find('span').simulate('click')
    tree.find('span').simulate('click')
    expect(tree.find('span').html()).toBe('<span>août</span>')
    tree.find('button').simulate('click')
    expect(tree.find('span').html()).toBe(`<span>${currentMonth}</span>`)
  })
})
