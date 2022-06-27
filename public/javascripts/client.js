const BoardPiece = {
    Empty: 0,
    Normal: 1,
    Special: 2,
}

const FigureType = {
    None: 0,
    Player1: 1,
    Player2: 2
}

class Game {
    constructor() {
        this.canvas = document.querySelector("#game canvas");
        this.context = this.canvas.getContext("2d");
        // Definice herního plánu
        this.board = [
            [BoardPiece.Normal, BoardPiece.Normal, BoardPiece.Normal],
            [BoardPiece.Special, BoardPiece.Normal, BoardPiece.Special],
            [BoardPiece.Empty, BoardPiece.Normal, BoardPiece.Empty],
            [BoardPiece.Empty, BoardPiece.Normal, BoardPiece.Empty],
            [BoardPiece.Normal, BoardPiece.Special, BoardPiece.Normal],
            [BoardPiece.Normal, BoardPiece.Normal, BoardPiece.Normal],
            [BoardPiece.Normal, BoardPiece.Normal, BoardPiece.Normal],
            [BoardPiece.Special, BoardPiece.Normal, BoardPiece.Special]
        ];

        this.config = {
            piece: {
                size: 40,
                spacing: 20
            },
            figure: {
                radius: 20
            }
        }

        // Seznam figurek ve hře
        // {type: FigureType.Player1, row: 2, column: 5}
        this.placed_figures = [];

        // Na začátku má každý 7 kamenů v ruce
        this.player_1_figures = 7;
        this.player_2_figures = 7;

        this.drawBoard();
    }

    mouseToRowAndColumn(mouse_x, mouse_y) {
        const rect = this.canvas.getBoundingClientRect();
        const scale_x = this.canvas.width / rect.width;
        const scale_y = this.canvas.height / rect.height;

        const x = (mouse_x - rect.left) * scale_x;
        const y = (mouse_y - rect.top) * scale_y;

        const size_with_spacing = (this.config.piece.size + this.config.piece.spacing);

        const column_hint = Math.round(x / size_with_spacing) - 1;
        const row_hint = Math.round(y / size_with_spacing) - 1;

        if (row_hint < 0 || column_hint < 0) {
            return null;
        }

        const row_bounds = {
            min: size_with_spacing * row_hint + this.config.piece.size,
            max: size_with_spacing * row_hint + 2 * this.config.piece.size
        };

        const column_bounds = {
            min: size_with_spacing * column_hint + this.config.piece.size,
            max: size_with_spacing * column_hint + 2 * this.config.piece.size,
        };

        // Je to uvnitř gridu?
        if (y > row_bounds.min && y < row_bounds.max && x > column_bounds.min && x <column_bounds.max) {
            if (this.board[row_hint][column_hint] === BoardPiece.Empty) {
                return null;
            }

            return {
                row: row_hint,
                column: column_hint
            };
        }

        return null;
    }

    rowAndColumnToCoordinates(row, column) {

        if (row < 0 || row > 7 || column < 0 || column > 2) {
            return null;
        }

        return {
            x: (this.config.piece.size + this.config.piece.spacing) * column + this.config.piece.size,
            y: (this.config.piece.size + this.config.piece.spacing) * row + this.config.piece.size
        }
    }

    drawDices(count) {
        const vertical_spacing = 10;
        const size = 30;

        for (let index = 0; index < 4; index++) {
            this.drawDice(
                (size + vertical_spacing) * index + size/2,
                (size * Math.cos(Math.PI / 6)) / 2, size, count-- > 0
            );
        }
    }

    drawDice(x, y, size, filled) {
        // Levý horní roh
        const center_x = x + size / 2;
        const center_y = y + (size * Math.cos(Math.PI / 6)) / 2;


        this.context.beginPath();
            this.context.moveTo(center_x, y);
            this.context.lineTo(center_x + size / 2, center_y + size / 2);
            this.context.lineTo(x, center_y + size / 2);
            this.context.lineTo(center_x, y);
        this.context.closePath();

        this.context.lineWidth = 2;
        this.context.strokeStyle = "gray";
        this.context.stroke();

        if (filled) {
            this.context.fillStyle = "gray";
            this.context.fill();
        }
    }

    drawBoard() {

        for(let row = 0; row < this.board.length; row++) {
            for (let column = 0; column < this.board[0].length; column++) {
                let coordinates = this.rowAndColumnToCoordinates(row, column);

                if (this.board[row][column] === BoardPiece.Normal) {
                    this.drawStandardBoardPiece(
                        coordinates.x,
                        coordinates.y,
                        this.config.piece.size, this.config.piece.size, this.config.piece.size / 4
                    );
                } else if (this.board[row][column] === BoardPiece.Special) {
                    this.drawSpecialBoardPiece(
                        coordinates.x,
                        coordinates.y,
                        this.config.piece.size

                    );
                }
            }
        }
    }

    drawFigure(x, y, color) {
        const center_x = x + this.config.figure.radius;
        const center_y = y + this.config.figure.radius;

        this.context.beginPath();
            // this.context.moveTo(x, y);
            this.context.arc(center_x, center_y, this.config.figure.radius, 0, 2 * Math.PI, false);
        this.context.closePath();

        this.context.lineWidth = 5;
        this.context.strokeStyle = color;
        this.context.stroke();
    }

    drawSpecialBoardPiece(x, y, size) {

        this.context.beginPath();
            this.context.moveTo(x + size/2, y);
            this.context.lineTo(x + size, y + size / 2);
            this.context.lineTo(x + size/2, y + size);
            this.context.lineTo(x, y +  size / 2);
            this.context.lineTo(x + size/2, y);

        this.context.fillStyle = "gray";
        this.context.fill();
    }

    drawStandardBoardPiece(x, y, size) {
        const radius = size / 4;
        this.context.beginPath();
            this.context.moveTo(x, y + radius );
            this.context.arcTo(x, y, x + radius, y, radius);
            this.context.lineTo(x + size - 2 * radius, y);
            this.context.arcTo(x + size, y, x + size, y + radius/2, radius);
            this.context.lineTo(x + size, y + size - 2 * radius);
            this.context.arcTo(x + size, y + size, x + size - 2 * radius, y + size, radius);
            this.context.lineTo(x + radius, y + size);
            this.context.arcTo(x, y + size, x, y + size - 2 * radius, radius);
            this.context.lineTo(x, y  + radius);
        this.context.fillStyle = "gray";
        this.context.fill();
    }
}

class Communication {
    constructor() {
        this.socket = new WebSocket("ws://royalur.online/ws");

        this._registerListener();
    }

    _registerListener() {
        this.socket.addEventListener("open", (event)=> {
           console.log("Connected");
        });

        this.socket.addEventListener("message", (event) => {
            console.log(event.data);
        });
    }


}

document.addEventListener("DOMContentLoaded", () => {
    const game = new Game;

    document.addEventListener("mousedown", (ev) => {
        let rc = game.mouseToRowAndColumn(ev.x, ev.y);
        if (rc != false) {
            let coord = game.rowAndColumnToCoordinates(rc.row, rc.column);

            game.drawFigure(coord.x, coord.y, "red");
        }
    })

    const comm = new Communication;
});
