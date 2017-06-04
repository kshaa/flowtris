define(function() {
    return {
        generate(w, h) {
            var field = new Array(h)
            for (i = 0; i < h; i++) {
                field[i] = new Array(w).fill(0)
            }
            return field
        }
    }
})
