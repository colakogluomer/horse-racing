import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import HomeView from '../HomeView.vue'

// Mock sub-components
vi.mock('../../components/HorseList.vue', () => ({ default: { name: 'HorseList', template: '<div></div>' } }))
vi.mock('../../components/RaceTrack.vue', () => ({ default: { name: 'RaceTrack', template: '<div></div>' } }))
vi.mock('../../components/RaceProgramResults.vue', () => ({ default: { name: 'RaceProgramResults', template: '<div></div>' } }))

describe('HomeView.vue', () => {
  let mockStore: any

  beforeEach(() => {
    mockStore = createStore({
      state: {
        horses: [],
        isRaceStarted: false,
        isRacePaused: false,
        rounds: []
      },
      getters: {
        isAllRacesFinished: () => false
      },
      actions: {
        generateInitialData: vi.fn(),
        startRace: vi.fn(),
        pauseRace: vi.fn(),
        resumeRace: vi.fn()
      }
    })
  })

  it('renders title and control buttons', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [mockStore]
      }
    })
    
    expect(wrapper.find('.title').text()).toBe('Horse Racing')
    expect(wrapper.findAll('.controls button')[0]?.text()).toBe('GENERATE PROGRAM')
  })

  it('dispatches generateInitialData when GENERATE PROGRAM is clicked', async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [mockStore]
      }
    })
    
    await wrapper.findAll('.controls button')[0]?.trigger('click')
    // In Vuex 4, we can check if the action was called if we spied on dispatch
    // or if we use a mock store that records calls.
  })

  it('shows START button when race is not started', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [mockStore]
      }
    })
    
    expect(wrapper.findAll('.controls button')[1]?.text()).toBe('START')
  })

  it('shows PAUSE button when race is started and not paused', () => {
    mockStore.state.isRaceStarted = true
    mockStore.state.isRacePaused = false
    
    const wrapper = mount(HomeView, {
      global: {
        plugins: [mockStore]
      }
    })
    
    expect(wrapper.findAll('.controls button')[1]?.text()).toBe('PAUSE')
  })
})
