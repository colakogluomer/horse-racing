import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RaceHorse from '../RaceHorse.vue'

describe('RaceHorse.vue', () => {
  const defaultProps = {
    name: 'Swift Buster',
    color: 'Red',
    position: 50,
    lane: 1
  }

  it('renders horse name and lane number', () => {
    const wrapper = mount(RaceHorse, {
      props: defaultProps
    })
    
    expect(wrapper.text()).toContain('Swift Buster')
    expect(wrapper.find('.lane-number').text()).toBe('1')
  })

  it('calculates correct position style including offset', () => {
    const wrapper = mount(RaceHorse, {
      props: { ...defaultProps, position: 100 }
    })
    
    const horseWrapper = wrapper.find('.horse-wrapper')
    // The environment might simplify calc(100% - (100 / 100 * 47px)) to calc(100% - 47px)
    expect(horseWrapper.attributes('style')).toMatch(/left: calc\(100% - \(?47px\)?\)/)
  })

  it('renders horse image with correct alt text', () => {
    const wrapper = mount(RaceHorse, {
      props: defaultProps
    })
    
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('alt')).toBe('Swift Buster')
  })
})
