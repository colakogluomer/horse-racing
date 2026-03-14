import { describe, it, expect, beforeEach } from 'vitest'
import store from '@/store'

describe('Horse Racing Vuex Store', () => {
  beforeEach(() => {
    // Reset state potentially? For simplicity we just use the store as is
    // since each test will trigger moves
  })

  it('generates exactly 20 horses with valid color names', () => {
    store.commit('GENERATE_HORSES')
    expect(store.state.horses).toHaveLength(20)
    
    const validColors = ['Red', 'Blue', 'Yellow', 'Green', 'Orange', 'Purple', 'Pink', 'Brown', 'Gray', 'Black']
    store.state.horses.forEach(horse => {
      expect(validColors).toContain(horse.color)
      expect(horse.condition).toBeGreaterThanOrEqual(1)
      expect(horse.condition).toBeLessThanOrEqual(100)
    })
  })

  it('generates a program with 6 rounds and 10 random horses per round', () => {
    store.commit('GENERATE_HORSES')
    store.commit('GENERATE_PROGRAM')
    
    expect(store.state.rounds).toHaveLength(6)
    
    const distances = [1200, 1400, 1600, 1800, 2000, 2200]
    store.state.rounds.forEach((round, index) => {
      expect(round.distance).toBe(distances[index])
      expect(round.participants).toHaveLength(10)
      
      // Participants should be from the master pool
      round.participants.forEach(p => {
        const found = store.state.horses.find(h => h.id === p.id)
        expect(found).toBeDefined()
      })
    })
  })

  it('correctly handles NEXT_ROUND mutation including completion state', () => {
    store.commit('GENERATE_HORSES')
    store.commit('GENERATE_PROGRAM')
    
    // Initial state
    expect(store.state.currentRoundIndex).toBe(0)
    
    // Go through all rounds
    for (let i = 0; i < 6; i++) {
      store.commit('NEXT_ROUND')
    }
    
    expect(store.state.currentRoundIndex).toBe(6) // Program finished
    
    // Incrementing further should not break (overflow check)
    store.commit('NEXT_ROUND')
    expect(store.state.currentRoundIndex).toBe(6)
  })

  it('correctly handles SET_ROUND_RESULTS mutation', () => {
    const dummyResults = [
      { horseId: 1, horseName: 'Horse 1', position: 1 },
      { horseId: 2, horseName: 'Horse 2', position: 2 }
    ]
    
    store.commit('SET_ROUND_RESULTS', { roundId: 1, rankings: dummyResults, distance: 1200 })
    
    expect(store.state.results).toHaveLength(1)
    expect(store.state.results[0]?.roundId).toBe(1)
    expect(store.state.results[0]?.rankings).toEqual(dummyResults)
  })

  it('correctly handles SET_RACE_STATE mutation', () => {
    store.commit('SET_RACE_STATE', { started: true, paused: true })
    expect(store.state.isRaceStarted).toBe(true)
    expect(store.state.isRacePaused).toBe(true)
    
    store.commit('SET_RACE_STATE', { started: false, paused: false })
    expect(store.state.isRaceStarted).toBe(false)
    expect(store.state.isRacePaused).toBe(false)
  })

  it('getters return correct currentRound', () => {
    store.commit('GENERATE_HORSES')
    store.commit('GENERATE_PROGRAM')
    
    // Round 0
    expect(store.getters.currentRound?.id).toBe(1)
    
    // Move to Round 1 (index 1)
    store.commit('NEXT_ROUND')
    expect(store.getters.currentRound?.id).toBe(2)
  })
})
