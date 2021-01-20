Solution to the further practice of [[https://reactjs.org/tutorial/tutorial.html][React's tic-tac-toe tutorial]].

Here are the improvements listed in order of increasing difficulty:
1. Display the location for each move in the format (col, row) in the move history list.
2. Bold the currently selected item in the move list.
3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
4. Add a toggle button that lets you sort the moves in either ascending or descending order.
5. When someone wins, highlight the three squares that caused the win.
6. When no one wins, display a message about the result being a draw.

# Uso

    git clone https://github.com/fisico-alienado/react-tres-en-raya.git
    cd react-tres-en-raya
    npm install
    npm start


# Follow-up tutorial
Start with the official final result here: [[https://codepen.io/gaearon/pen/gWWZgR?editors=0010][Starter Code]].
O empieza en el commit 'Juego tres en raya con React creado con el tutorial oficial' - 8039979109acb8ba3d0e11681e8062549b905757

## Display the location for each move
We've used the =squares= array to store the board state of each step in class =Game=. We can count out the lastest moved square of each step by comparing the current squares element to the previous one. But we will avoid this by storing the index of the lastest moved square in each =history= element in the =handleClick= method: 

#+BEGIN_SRC js
  handleClick(i) {
    // ...
    this.setState({
      history: history.concat([
        {
          squares: squares,
          // Store the index of the latest moved square
          latestMoveSquare: i
        }
      ]),
    });
    // ...
  }
#+END_SRC

With the =lastestMoveSquare=, we can easily count out the location of each move in the format (col, row) and append this format string to =desc=. Notice that we will use [[https://developer.mozilla.org/en-US/docs/Web][template string]] in the snippet, which is a feature from ES6:

#+BEGIN_SRC js
  render() {
    const history = this.state.history;
    const stepNumber = this.state.stepNumber;
    const current = history[stepNumber];

    const moves = history.map((step, move) => {
      const latestMoveSquare = step.latestMoveSquare;
      const col = 1 + latestMoveSquare % 3;
      const row = 1 + Math.floor(latestMoveSquare / 3);
      const desc = move ?
        `Go to move #${move} (${col}, ${row})` :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    // ...
  }
#+END_SRC

Now if you run ~npm start~ in the project folder and open [[http://localhost:3000]] in the browser, you should see the location for each move in each button of the move history list except the =Go to game start=.   

## Bold the currently selected item
Append this stype for bold item to your =src/index.css= file:

#+BEGIN_SRC css
.move-list-item-selected{
  float: left;
  font-weight: bold;
}
#+END_SRC

With a little change in the =render= method of =Game= class, we can achieve the goal. We will apply the =move-list-item-selected= class if ~move === stepNumber~, which means the item is selected:

#+BEGIN_SRC js
  render() {
    // ...
    const moves = history.map((step, move) => {
      const latestMoveSquare = step.latestMoveSquare;
      const col = 1 + latestMoveSquare % 3;
      const row = 1 + Math.floor(latestMoveSquare / 3);
      const desc = move ?
        `Go to move #${move} (${col}, ${row})` :
        'Go to game start';
      return (
        <li key={move}>
          {/# Bold the currently selected item #/ }
          <button
            className={move === stepNumber ? 'move-list-item-selected' : ''}
            onClick={() => this.jumpTo(move)}>{desc}
          </button>
        </li>
      );
    });
    // ...
  }
#+END_SRC

## Use two loops to make the squares
The original implementation of rendering the squares in class =Board= is hardcoded. We can do it better by using two loops:  

#+BEGIN_SRC js
render() {
    // Use two loops to make the squares
    const boardSize = 3;
    let squares = [];
    for(let i=0; i<boardSize; ++i) {
      let row = [];
      for(let j=0; j<boardSize; ++j) {
        row.push(this.renderSquare(i # boardSize + j));
      }
      squares.push(<div key={i} className="board-row">{row}</div>);
    }

    return (
      <div>{squares}</div>
    );
  }
#+END_SRC

Each step in the first loop, we create a board row. And each step in the second loop, we add a square to the row. 

## Add a toggle button for sorting
So far, the moves list is displayed in ascending order by default, from game start to the latest step. We need to enable the moves list to be displayed in descending order, from lastest step to game start, and add a toggle button to switch the sorting order. 
At first, add =isAscending= state representing which order should be displayed to the constructor: 

#+BEGIN_SRC js
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // ...
      isAscending: true
    };
  }
  // ...
}
#+END_SRC

Add the toggle button to =render= method in =Game=. It will have different content according to the =isAscending= state: 

#+BEGIN_SRC js
  render() {
    // ...
    const isAscending = this.state.isAscending;

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.handleSortToggle()}>
            {isAscending ? 'descending' : 'ascending'}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
#+END_SRC

When the toggle button is clicked, =handleSortToggle= will be called. What this handler does is just flipping and saving the boolean state: 

#+BEGIN_SRC js
  handleSortToggle() {
    this.setState({
      isAscending: !this.state.isAscending
    });
  }
#+END_SRC

At last, the moves list should be displayed in the right order corresponding to the =isAscending= state. For ascending, the =moves= is in the right order already. For descending, we reverse the =moves= array to let it be in the right order. Note that we also change the definition of =moves= from =const= to =let= because we may change it:

#+BEGIN_SRC js
  render() {

    let moves = history.map((step, move) => {
      // ...
    });
    
    // ...

    const isAscending = this.state.isAscending;
    if (!isAscending) {
      moves.reverse();
    }

    return (
      // ...
    );
  }
#+END_SRC

## Highlight the squares when someone wins
Append this stype for highlight square to the =src/index.css= file:

#+BEGIN_SRC css
.square.highlight {
  background: #ddd
}
#+END_SRC

We have used =calculateWinner= to declare the winner. We can get the three squares or the line that caused the win easily by modifying the return value of this function:

#+BEGIN_SRC js
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i],
      };
    }
  }

  return {
    winner: null,
  };
#+END_SRC

Then change the =handleClick= in =Game= since the return value of =calculateWinner= has been modified:

#+BEGIN_SRC js
  handleClick(i) {
    // ...
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    // ...
  }
#+END_SRC

Then also change the =render= in =Game=. And we will pass the =winLine= through props to =Board=:

#+BEGIN_SRC js
  render() {
    // ...
    const winInfo = calculateWinner(current.squares);
    const winner = winInfo.winner;

    let moves = history.map((step, move) => {
      // ...
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    // ...

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winLine={winInfo.line}
          />
        </div>
        // ...
      </div>
    );
  }
#+END_SRC

Then change the =renderSquare= in =Board=. If the current index of square is included in the =winLine= array, expression ~winLine && winLine.includes(i)~ will be evaluated to =true=, otherwise =false=. This will be passed to =Square= through the =highlight= props:

#+BEGIN_SRC js
  renderSquare(i) {
    const winLine = this.props.winLine;
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={winLine && winLine.includes(i)}
      />
    );
  }
#+END_SRC

Finally, =Square= will apply the css class depending on the =highlight= props:

#+BEGIN_SRC js
function Square(props) {
  const className = 'square' + (props.highlight ? ' highlight' : '');
  return (
    <button
      className={className}
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}
#+END_SRC

## Display draw message
If the board is full (no next move can be taken) and there is no winner, we can say that the result is a draw. To get whether the current move results in a draw, we need to revise the =calculateWinner= function: 

#+BEGIN_SRC js
function calculateWinner(squares) {
  const lines = [
    // ...
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i],
        isDraw: false,
      };
    }
  }

  let isDraw = true;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      isDraw = false;
      break;
    }
  }
  return {
    winner: null,
    line: null,
    isDraw: isDraw,
  };
}
#+END_SRC
   
Now that the result object of the =calculateWinner= function has a new =isDraw= attribute. Then we will change the part for displaying game status of the =render= in =Game=:

#+BEGIN_SRC js
  render() {
    // ...

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      if (winInfo.isDraw) {
        status = "Draw";
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
    }
    // ...
  }
#+END_SRC

We have accomplished all the improvements. Check out the final code in this repository.


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

##Note: this is a one-way operation. Once you `eject`, you can’t go back!##

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
