define(function() {
    return function Renderer(t) {
        this.lastfield = undefined
        this.draw = function() {
            let field = t.field()
            let container = document
                .getElementById('tetris')
                .innerHTML
            if (container == "") {
                this._generate(field)
            } else {
                this._update(field)
            }
            this.lastfield = field
        }
        this._generate = function(array) {
            let result = ["<table border=1'>"]
            for(i = 0; i < array.length; i++) {
                result.push("<tr>")
                for(j = 0; j < array[0].length; j++) {
                    let cell = array[i][j]
                    if (cell != 0) {
                        result.push('<td id="y' + i + 'x' + j + '" class="filled ' + cell + '">' + cell + '</td>')
                    } else {                                      
                        result.push('<td id="y' + i + 'x' + j + '" class="empty">' + cell + '</td>')
                    }
                }
                result.push("</tr>")
            }
            result.push("</table>")
            document
                .getElementById('tetris')
                .innerHTML = result.join('\n')
        }
        this._update = function(array) {
            for (i = 0; i < array.length; i++) {
                for (j = 0; j < array[0].length; j++) {
                    let newvalue = array[i][j]
                    let oldvalue = this.lastfield[i][j]
                    if (newvalue != oldvalue) {
                        let element = undefined;
                        element = document.getElementById('y' + i + 'x' + j)
                        element.innerHTML = newvalue
                        element.classList = 'y' + i + 'x' + j + ' ' + newvalue
                        if (newvalue != 0) {
                            element.classList.add('filled')
                        } else {
                            element.classList.add('empty')
                        }
                    }
                }
            }
        }
    }
})
