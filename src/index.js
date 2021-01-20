import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} />
    )
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  // El método 'constructor' es un metodo especial para crear e inicializar un objeto creado a partir de una clase.
  constructor(props) {
    // La palabra clave 'super' es usada para llamar funciones del objeto padre. Necesitas siempre llamar super cuando defines el constructor de una subclase. 
    // Todas las clases de componentes de React que tienen un constructor deben empezar con una llamada a super(props).
    // ¿Para qué necesitamos 'super(props)'--> Nos da acceso a 'this.props' en el Constructor.
    super(props)
    this.state = { // El estado de cada cuadrado se va a almacenar y manejar desde la clase 'Game' y de ahí se la enviamos al resto de subclases dependientes: 'Board'
      history: [{ // Objeto con un array
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    // con .slice() hacemos una copia del array para luego adjudicarle valores --> La INMUTABILIDAD de los datos es fundamental en React
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) { // Si calculateWinner es 'true' o si el cuadrado número 'i' ya ha sido rellenado:
      return // Ignoramos el click, no devolvemos nada
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      // El método concat() se usa para unir dos o más arrays. Este método no cambia los arrays existentes, sino que devuelve un nuevo array --> INMUTABILIDAD.
      history: history.concat([{
        squares: squares // nuevo array de squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext // Modifica el valor del booleano 'xIsNext'.
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0 // Si es par, xIsNext = true
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const moves = history.map((step, move) => { // .map((currentValue, index))
      const desc = move ? `Go to move #${move}` : 'Go to game start'
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    let status
    if (winner) { // si la variable 'winner' es true
      status = 'Winner: ' + winner
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [ // Todas las posibles líneas ganadoras
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}