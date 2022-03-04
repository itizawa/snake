import React from "react";
import "./App.css";

import ClassNames from "classnames";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      score: 0,
      gridSize: 10,
      time: 0,
      fruitIndex: 0,

      snakeStatus: {
        xPosition: 1,
        yPosition: 3,
        direction: "→",
        speed: 400,
        body: [0]
      }
    };
    this.countTime = this.countTime.bind(this);
    this.moveSnake = this.moveSnake.bind(this);
    this.onChangeDirection = this.onChangeDirection.bind(this);
    this.randomizeFruitIndex = this.randomizeFruitIndex.bind(this);
  }

  // ゲーム開始
  componentDidMount() {
    // キーボード入力のイベントをon_keydownメソッドに投げる
    document.onkeydown = (event) => {
      this.onChangeDirection(event.keyCode);
    };

    this.randomizeFruitIndex();
    this.countTime();
    this.moveSnake();
  }

  isEatFruit() {
    return this.state.fruitIndex === this.returnHeadIndex();
  }

  isSuicided() {
    const headIndex = this.returnHeadIndex()
    return this.state.snakeStatus.body.includes(headIndex);
  }

  isFrameOut() {
    const { gridSize } = this.state;
    const { xPosition, yPosition } = this.state.snakeStatus;
    return (
      xPosition < 0 ||
      gridSize <= xPosition ||
      yPosition < 0 ||
      gridSize <= yPosition
    );
  }

  isGameOver() {
    return this.isFrameOut() || this.isSuicided();
  }

  returnHeadIndex() {
    if (this.isFrameOut()) return null;
    return (
      this.state.snakeStatus.yPosition * this.state.gridSize +
      this.state.snakeStatus.xPosition
    );
  }

  countTime() {
    if (this.isGameOver()) return;
    this.setState({ time: this.state.time + 1 });
    setTimeout(this.countTime, 1000);
  }

  moveSnake() {
    if (this.isGameOver()) return;
    const newSnakeStatus = this.state.snakeStatus;
    let { speed, direction, body } = newSnakeStatus;

    // 体の最後尾を頭に持ってくる
    body.shift();
    body.push(this.returnHeadIndex());

    switch (direction) {
      case "→":
        newSnakeStatus.xPosition++;
        break;
      case "↓":
        newSnakeStatus.yPosition++;
        break;
      case "←":
        newSnakeStatus.xPosition--;
        break;
      case "↑":
        newSnakeStatus.yPosition--;
        break;
      default:
        this.setState({ snakeStatus: newSnakeStatus });
    }

    if (this.isEatFruit()) {
      this.randomizeFruitIndex();
      body.unshift([0]);
      if (speed > 50) {
        newSnakeStatus.speed = speed - 20;
      }
      this.setState({ snakeStatus: newSnakeStatus });
      this.setState({ score: this.state.score + body.length*100 });
    }

    this.setState({ score: this.state.score + newSnakeStatus.body.length });

    setTimeout(this.moveSnake, speed);
  }

  onChangeDirection(keyCode) {
    const newSnakeStatus = this.state.snakeStatus;
    const { direction } = newSnakeStatus;
    switch (keyCode) {
      case 37:
        if (direction !== "→") {
          newSnakeStatus.direction = "←";
        }
        break;
      case 38:
        if (direction !== "↓") {
          newSnakeStatus.direction = "↑";
        }
        break;
      case 39:
        if (direction !== "←") {
          newSnakeStatus.direction = "→";
        }
        break;
      case 40:
        if (direction !== "↑") {
          newSnakeStatus.direction = "↓";
        }
        break;
      default:
        this.setState({ snakeStatus: newSnakeStatus });
    }
  }

  // ヘビの体を伸ばす
  growUpSnake() {
    const newSnakeStatus = this.state.snakeStatus;
    newSnakeStatus.body.unshift(newSnakeStatus.body[0]);
    this.setState({ snakeStatus: newSnakeStatus });
  }

  randomizeFruitIndex() {
    const { gridSize } = this.state;
    const fruitIndex = Math.floor(Math.random() * gridSize * gridSize);
    this.setState({ fruitIndex });
  }

  render() {
    const { gridSize } = this.state;

    const mapStyle = {
      gridSize: gridSize,
      display: "grid",
      gridTemplateColumns: `repeat(${gridSize}, 30px)`,
      gridTemplateRows: `repeat(${gridSize}, 30px)`,
      margin: "0 auto",
      width: "300px"
    };

    const mapTiles = [];

    for (let index = 0; index < gridSize * gridSize; index++) {
      const tileStyle = ClassNames({
        defaultTile: true,
        snakeHead: this.returnHeadIndex() === index,
        snakeBody: this.state.snakeStatus.body.includes(index),
        fruitColor: this.state.fruitIndex === index
      });

      mapTiles.push(<div key={index} className={tileStyle} />);
    }

    return (
      <div className="App">
        <h1>Snake Game</h1>
        <p>
          SCORE:{this.state.score} TIME:{this.state.time}
        </p>
        <div id="map" style={mapStyle}>
          {mapTiles}
        </div>
        {this.isGameOver() && <h2>GameOver</h2>}
      </div>
    );
  }
}

export default App;