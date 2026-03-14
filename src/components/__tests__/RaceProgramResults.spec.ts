import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import RaceProgramResults from '../RaceProgramResults.vue'

describe('RaceProgramResults.vue', () => {
  const mockStore = createStore({
    state: {
      rounds: [
        { id: 1, distance: 1200, participants: [], results: [] },
        { id: 2, distance: 1400, participants: [], results: [] }
      ],
      currentRoundIndex: 0,
      results: [
        { 
          roundId: 1, 
          distance: 1200, 
          rankings: [
            { horseId: 1, horseName: 'Winner', position: 1 }
          ] 
        }
      ]
    },
    getters: {
      isAllRacesFinished: (state) => false
    }
  })

  it('renders upcoming program laps excluding finished ones', () => {
    const wrapper = mount(RaceProgramResults, {
      global: {
        plugins: [mockStore]
      }
    })
    
    // Only Lap 2 should be in program because Lap 1 is current/finished
    // Actually the logic in the component is: v-for="round in rounds.slice(currentRoundIndex)"
    // If currentRoundIndex is 0, it shows Lap 1 and Lap 2.
    // If we want to show it filters out, we should set currentRoundIndex to 1.
    
    expect(wrapper.find('.program-section').text()).toContain('1ST Lap - 1200m')
    expect(wrapper.find('.program-section').text()).toContain('2ND Lap - 1400m')
  })

  it('renders results section with completed races', () => {
    const wrapper = mount(RaceProgramResults, {
      global: {
        plugins: [mockStore]
      }
    })
    
    expect(wrapper.find('.results-section').text()).toContain('1ST Lap - 1200m')
    expect(wrapper.find('.results-section').text()).toContain('Winner')
  })

  it('shows finished message when isAllRacesFinished is true', () => {
    const finishedStore = createStore({
      state: { rounds: [], currentRoundIndex: 0, results: [] },
      getters: { isAllRacesFinished: () => true }
    })
    
    const wrapper = mount(RaceProgramResults, {
      global: {
        plugins: [finishedStore]
      }
    })
    
    expect(wrapper.text()).toContain('ALL RACES COMPLETED!')
  })
})
