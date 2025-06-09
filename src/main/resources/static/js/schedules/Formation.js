export class Formation {
    static CONSTANTS = Object.freeze({
        PLAYER_COUNT: 11
    })

    #quarters = {}
    #currentQuarter = 1
    #layouts = {}

    constructor({ formations = [] }) {
        formations.forEach((formation) => {
            this.#layouts[formation] = []
            formation.split('').reverse().forEach((position, row) => {

                const cols = Number(position)
                for (let col = 1; col <= cols; col++) {
                    this.#layouts[formation].push({ row: row + 1, col: col})
                }
            })

            // GK
            this.#layouts[formation].push({ row: formation.length + 1, col: 1})
        })

        this.#quarters = {
            1: { formation: formations[0], players: {} },
            2: { formation: formations[0], players: {} },
            3: { formation: formations[0], players: {} },
            4: { formation: formations[0], players: {} }
        }
    }

    initQuarters(formations) {
        this.#quarters = {
            1: { formation: formations[0], players: {} },
            2: { formation: formations[1], players: {} },
            3: { formation: formations[2], players: {} },
            4: { formation: formations[3], players: {} }
        }
    }

    getQuarters() {
        return this.#quarters
    }

    getQuarter(quarter = 1) {
        return this.#quarters[quarter]
    }

    getLayouts() {
        return this.#layouts
    }

    setCurrentQuarter(quarter = 1) {
        this.#currentQuarter = quarter
    }

    getFormation() {
        return this.#quarters[this.#currentQuarter].formation
    }

    setFormation(formation = '') {
        this.#quarters[this.#currentQuarter].formation = formation
    }

    getPlayers() {
        return this.#quarters[this.#currentQuarter].players
    }

    getPlayer(position = 0) {
        return this.#quarters[this.#currentQuarter].players[position]
    }

    setPlayer(
        position = 0,
        player = {
            id: 0,
            type: '',
            name: ''
        }
    ) {
        this.#quarters[this.#currentQuarter].players[position] = player
    }

    removePlayer(position = 0) {
        delete this.#quarters[this.#currentQuarter].players[position]
    }
}