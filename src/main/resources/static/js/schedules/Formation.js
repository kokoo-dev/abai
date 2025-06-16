export class Formation {
    #quarters = {}
    #currentQuarter = 1
    #positions = {
        CF: 'CF',
        SS: 'SS',
        LW: 'LW',
        RW: 'RW',
        AM: 'AM',
        CM: 'CM',
        CDM: 'CDM',
        RB: 'RB',
        LB: 'LB',
        CB: 'CB',
        GK: 'GK'
    }
    #layouts = new Map([
        ['4231', [
            {
                row: 1,
                col: 1,
                position: this.#positions.CF
            },
            {
                row: 2,
                col: 1,
                position: this.#positions.LW
            },
            {
                row: 2,
                col: 2,
                position: this.#positions.AM
            },
            {
                row: 2,
                col: 3,
                position: this.#positions.RW
            },
            {
                row: 3,
                col: 1,
                position: this.#positions.CDM
            },
            {
                row: 3,
                col: 2,
                position: this.#positions.CDM
            },
            {
                row: 4,
                col: 1,
                position: this.#positions.LB
            },
            {
                row: 4,
                col: 2,
                position: this.#positions.CB
            },
            {
                row: 4,
                col: 3,
                position: this.#positions.CB
            },
            {
                row: 4,
                col: 4,
                position: this.#positions.RB
            },
            {
                row: 5,
                col: 1,
                position: this.#positions.GK
            }
        ]],
        ['442', [
            {
                row: 1,
                col: 1,
                position: this.#positions.CF
            },
            {
                row: 1,
                col: 2,
                position: this.#positions.CF
            },
            {
                row: 2,
                col: 1,
                position: this.#positions.LW
            },
            {
                row: 2,
                col: 2,
                position: this.#positions.CM
            },
            {
                row: 2,
                col: 3,
                position: this.#positions.CM
            },
            {
                row: 2,
                col: 4,
                position: this.#positions.RW
            },
            {
                row: 3,
                col: 1,
                position: this.#positions.LB
            },
            {
                row: 3,
                col: 2,
                position: this.#positions.CB
            },
            {
                row: 3,
                col: 3,
                position: this.#positions.CB
            },
            {
                row: 3,
                col: 4,
                position: this.#positions.RB
            },
            {
                row: 4,
                col: 1,
                position: this.#positions.GK
            }
        ]],
        ['4411', [
            {
                row: 1,
                col: 1,
                position: this.#positions.CF
            },
            {
                row: 2,
                col: 1,
                position: this.#positions.SS
            },
            {
                row: 3,
                col: 1,
                position: this.#positions.LW
            },
            {
                row: 3,
                col: 2,
                position: this.#positions.CM
            },
            {
                row: 3,
                col: 3,
                position: this.#positions.CM
            },
            {
                row: 3,
                col: 4,
                position: this.#positions.RW
            },
            {
                row: 4,
                col: 1,
                position: this.#positions.LB
            },
            {
                row: 4,
                col: 2,
                position: this.#positions.CB
            },
            {
                row: 4,
                col: 3,
                position: this.#positions.CB
            },
            {
                row: 4,
                col: 4,
                position: this.#positions.RB
            },
            {
                row: 5,
                col: 1,
                position: this.#positions.GK
            }
        ]],
        ['433', [
            {
                row: 1,
                col: 1,
                position: this.#positions.LW
            },
            {
                row: 1,
                col: 2,
                position: this.#positions.CF
            },
            {
                row: 1,
                col: 3,
                position: this.#positions.RW
            },
            {
                row: 2,
                col: 1,
                position: this.#positions.LW
            },
            {
                row: 2,
                col: 2,
                position: this.#positions.CM
            },
            {
                row: 2,
                col: 3,
                position: this.#positions.RW
            },
            {
                row: 3,
                col: 1,
                position: this.#positions.LB
            },
            {
                row: 3,
                col: 2,
                position: this.#positions.CB
            },
            {
                row: 3,
                col: 3,
                position: this.#positions.CB
            },
            {
                row: 3,
                col: 4,
                position: this.#positions.RB
            },
            {
                row: 4,
                col: 1,
                position: this.#positions.GK
            }
        ]],
        ['424', [
            {
                row: 1,
                col: 1,
                position: this.#positions.LW
            },
            {
                row: 1,
                col: 2,
                position: this.#positions.CF
            },
            {
                row: 1,
                col: 3,
                position: this.#positions.CF
            },
            {
                row: 1,
                col: 4,
                position: this.#positions.RW
            },
            {
                row: 2,
                col: 1,
                position: this.#positions.CM
            },
            {
                row: 2,
                col: 2,
                position: this.#positions.CM
            },
            {
                row: 3,
                col: 1,
                position: this.#positions.LB
            },
            {
                row: 3,
                col: 2,
                position: this.#positions.CB
            },
            {
                row: 3,
                col: 3,
                position: this.#positions.CB
            },
            {
                row: 3,
                col: 4,
                position: this.#positions.RB
            },
            {
                row: 4,
                col: 1,
                position: this.#positions.GK
            }
        ]],
        ['532', [
            {
                row: 1,
                col: 1,
                position: this.#positions.CF
            },
            {
                row: 1,
                col: 2,
                position: this.#positions.CF
            },
            {
                row: 2,
                col: 1,
                position: this.#positions.LW
            },
            {
                row: 2,
                col: 2,
                position: this.#positions.CM
            },
            {
                row: 2,
                col: 3,
                position: this.#positions.RW
            },
            {
                row: 3,
                col: 1,
                position: this.#positions.LB
            },
            {
                row: 3,
                col: 2,
                position: this.#positions.CB
            },
            {
                row: 3,
                col: 3,
                position: this.#positions.CB
            },
            {
                row: 3,
                col: 4,
                position: this.#positions.CB
            },
            {
                row: 3,
                col: 5,
                position: this.#positions.RB
            },
            {
                row: 4,
                col: 1,
                position: this.#positions.GK
            }
        ]],
        ['352', [
            {
                row: 1,
                col: 1,
                position: this.#positions.CF
            },
            {
                row: 1,
                col: 2,
                position: this.#positions.CF
            },
            {
                row: 2,
                col: 1,
                position: this.#positions.LB
            },
            {
                row: 2,
                col: 2,
                position: this.#positions.CM
            },
            {
                row: 2,
                col: 3,
                position: this.#positions.CM
            },
            {
                row: 2,
                col: 4,
                position: this.#positions.CM
            },
            {
                row: 2,
                col: 5,
                position: this.#positions.RB
            },
            {
                row: 3,
                col: 1,
                position: this.#positions.CB
            },
            {
                row: 3,
                col: 2,
                position: this.#positions.CB
            },
            {
                row: 3,
                col: 3,
                position: this.#positions.CB
            },
            {
                row: 4,
                col: 1,
                position: this.#positions.GK
            }
        ]],
        ['343', [
            {
                row: 1,
                col: 1,
                position: this.#positions.LW
            },
            {
                row: 1,
                col: 2,
                position: this.#positions.CF
            },
            {
                row: 1,
                col: 3,
                position: this.#positions.RW
            },
            {
                row: 2,
                col: 1,
                position: this.#positions.LB
            },
            {
                row: 2,
                col: 2,
                position: this.#positions.CM
            },
            {
                row: 2,
                col: 3,
                position: this.#positions.CM
            },
            {
                row: 2,
                col: 4,
                position: this.#positions.RB
            },
            {
                row: 3,
                col: 1,
                position: this.#positions.CB
            },
            {
                row: 3,
                col: 2,
                position: this.#positions.CB
            },
            {
                row: 3,
                col: 3,
                position: this.#positions.CB
            },
            {
                row: 4,
                col: 1,
                position: this.#positions.GK
            }
        ]]
    ])

    constructor() {
        const defaultFormation = this.#layouts.keys().next().value
        this.#quarters = {
            1: { formation: defaultFormation, players: {} },
            2: { formation: defaultFormation, players: {} },
            3: { formation: defaultFormation, players: {} },
            4: { formation: defaultFormation, players: {} }
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

    getLayout() {
        return this.#layouts.get(this.#quarters[this.#currentQuarter].formation)
    }

    getCurrentQuarter() {
        return this.#currentQuarter
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