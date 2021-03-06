import React from 'react'
import Enzyme, {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import controller from '../controller'
import Calendar from '../calendar'

Enzyme.configure({adapter: new Adapter()})

describe('Calendar', () => {
  test('createContext', () => {
    const enhance = controller(['nodes', 'showWeekend'])
    const Test = props => <span />
    const Rec = enhance(props => <Test {...props} />)
    const tree = mount(
      <Calendar data={[]}>
        <Rec />
      </Calendar>
    )
    expect(tree.find(Test).props()).toEqual({nodes: {}, showWeekend: true})
  })
  test('test toggleWeekend', () => {
    const enhance = controller(['showWeekend', 'toggleWeekend'])
    const Test = props => <span onClick={() => props.toggleWeekend()} />
    const Rec = enhance(props => <Test {...props} />)
    const tree = mount(
      <Calendar data={[]}>
        <Rec />
      </Calendar>
    )
    tree.find('span').simulate('click')
    expect(tree.find(Test).props()).toEqual(
      expect.objectContaining({
        showWeekend: false,
      })
    )
  })
})
