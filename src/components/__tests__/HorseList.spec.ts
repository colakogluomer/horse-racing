import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import HorseList from '../HorseList.vue'

describe('HorseList.vue', () => {
  const mockStore = createStore({
    state: {
      horses: [
        { id: 1, name: 'Horse 1', condition: 85, color: 'Red' },
        { id: 2, name: 'Horse 2', condition: 90, color: 'Blue' }
      ]
    }
  })

  it('renders horse list header', () => {
    const wrapper = mount(HorseList, {
      global: {
        plugins: [mockStore]
      }
    })
    expect(wrapper.find('.header').text()).toBe('Horse List (1- 20)')
  })

  it('renders all horses from the store', () => {
    const wrapper = mount(HorseList, {
      global: {
        plugins: [mockStore]
      }
    })
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)
    expect(rows[0]?.text()).toContain('Horse 1')
    expect(rows[0]?.text()).toContain('85')
    expect(rows[0]?.text()).toContain('Red')
    expect(rows[1]?.text()).toContain('Horse 2')
    expect(rows[1]?.text()).toContain('90')
    expect(rows[1]?.text()).toContain('Blue')
  })
})
