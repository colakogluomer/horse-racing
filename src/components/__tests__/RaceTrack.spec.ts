import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import RaceTrack from '../RaceTrack.vue'

// Mock RaceHorse to simplify RaceTrack tests
vi.mock('../RaceHorse.vue', () => ({
  default: {
    name: 'RaceHorse',
    template: '<div class="mock-race-horse"></div>',
    props: ['name', 'color', 'position', 'lane']
  }
}))

describe('RaceTrack.vue', () => {
  let mockStore: any

  beforeEach(() => {
    mockStore = createStore({
      state: {
        isRaceStarted: false,
        isRacePaused: false
      },
      getters: {
        currentRound: () => ({
          id: 1,
          distance: 1200,
          participants: [
            { id: 1, name: 'Horse 1', condition: 80, color: 'Red' },
            { id: 2, name: 'Horse 2', condition: 70, color: 'Blue' }
          ]
        })
      },
      actions: {
        finishRace: vi.fn()
      }
    })

    // Mock requestAnimationFrame
    vi.stubGlobal('requestAnimationFrame', vi.fn())
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
  })

  it('initializes horse positions on mount', () => {
    const wrapper = mount(RaceTrack, {
      global: {
        plugins: [mockStore]
      }
    })
    
    expect(wrapper.findAll('.lane')).toHaveLength(2)
    expect(wrapper.text()).toContain('1st Lap 1200m')
  })

  it('starts animation loop when isRaceStarted changes to true', async () => {
    const wrapper = mount(RaceTrack, {
      global: {
        plugins: [mockStore]
      }
    })
    
    mockStore.state.isRaceStarted = true
    await wrapper.vm.$nextTick()
    
    expect(window.requestAnimationFrame).toHaveBeenCalled()
  })

  it('renders correct lap suffix', () => {
    const round2Store = createStore({
      state: { isRaceStarted: false, isRacePaused: false },
      getters: { 
        currentRound: () => ({ id: 2, distance: 1400, participants: [] })
      }
    })
    
    const wrapper = mount(RaceTrack, {
      global: {
        plugins: [round2Store]
      }
    })
    
    expect(wrapper.find('.lap-info').text()).toContain('2nd Lap')
  })
})
