export class Formation {
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
    }

    getLayouts() {
        return this.#layouts
    }
}