import { createStore } from 'vuex'

export interface Horse {
  id: number
  name: string
  condition: number
  color: string
}

export interface RaceRound {
  id: number
  distance: number
  participants: Horse[]
  results: RaceResult[]
}

export interface RaceResult {
  horseId: number
  horseName: string
  position: number
}

export interface State {
  horses: Horse[]
  rounds: RaceRound[]
  currentRoundIndex: number
  isRaceStarted: boolean
  isRacePaused: boolean
  results: { roundId: number; distance: number; rankings: RaceResult[] }[]
}

const HORSE_NAMES = [
  'Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton', 'Joan Clarke',
  'Frances Allen', 'Barbara Liskov', 'Shafi Goldwasser', 'Annie Easley',
  'Radia Perlman', 'Elizabeth Holberton', 'Jean Bartik', 'Kathleen Antonelli',
  'Marlyn Meltzer', 'Ruth Teitelbaum', 'Ida Rhodes', 'Mary Kenneth Keller',
  'Thelma Estrin', 'Karen Spärck Jones', 'Sophie Wilson', 'Dorothy Vaughan'
]

const DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200]

export default createStore<State>({
  state: {
    horses: [],
    rounds: [],
    currentRoundIndex: -1,
    isRaceStarted: false,
    isRacePaused: false,
    results: []
  },
  mutations: {
    GENERATE_HORSES(state) {
      const colorNames = ['Red', 'Blue', 'Yellow', 'Green', 'Orange', 'Purple', 'Pink', 'Brown', 'Gray', 'Black']
      state.horses = HORSE_NAMES.map((name, index) => ({
        id: index + 1,
        name,
        condition: Math.floor(Math.random() * 100) + 1,
        color: colorNames[index % colorNames.length]!
      }))
    },
    GENERATE_PROGRAM(state) {
      if (state.horses.length === 0) return
      
      state.rounds = DISTANCES.map((distance, index) => {
        // Select 10 random horses
        const shuffled = [...state.horses].sort(() => 0.5 - Math.random())
        const participants = shuffled.slice(0, 10)
        return {
          id: index + 1,
          distance,
          participants,
          results: []
        }
      })
      state.currentRoundIndex = 0
      state.results = []
      state.isRaceStarted = false
      state.isRacePaused = false
    },
    SET_RACE_STATE(state, { started, paused }: { started?: boolean; paused?: boolean }) {
      if (started !== undefined) state.isRaceStarted = started
      if (paused !== undefined) state.isRacePaused = paused
    },
    SET_ROUND_RESULTS(state, { roundId, rankings }: { roundId: number; rankings: RaceResult[] }) {
      const round = state.rounds.find(r => r.id === roundId)
      if (round) {
        round.results = rankings
        state.results.push({
          roundId,
          distance: round.distance,
          rankings
        })
      }
    },
    NEXT_ROUND(state) {
      if (state.currentRoundIndex < state.rounds.length) {
        state.currentRoundIndex++
        state.isRaceStarted = false
        state.isRacePaused = false
      }
    }
  },
  actions: {
    generateInitialData({ commit }) {
      commit('GENERATE_HORSES')
      commit('GENERATE_PROGRAM')
    },
    startRace({ commit }) {
      commit('SET_RACE_STATE', { started: true, paused: false })
    },
    pauseRace({ commit }) {
      commit('SET_RACE_STATE', { paused: true })
    },
    resumeRace({ commit }) {
      commit('SET_RACE_STATE', { paused: false })
    },
    finishRace({ commit, state }, rankings: RaceResult[]) {
      const currentRound = state.rounds[state.currentRoundIndex]
      if (currentRound) {
        commit('SET_ROUND_RESULTS', { roundId: currentRound.id, rankings })
      }
      commit('SET_RACE_STATE', { started: false, paused: false })
      
      // Always move to next round (even if it exceeds the length to signal completion)
      commit('NEXT_ROUND')
    }
  },
  getters: {
    currentRound: (state) => state.rounds[state.currentRoundIndex] || null,
    isAllRacesFinished: (state) => state.results.length === state.rounds.length && state.rounds.length > 0
  }
})
