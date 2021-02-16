import { useStickyState } from "hooks"
import { DefaultButton, SquareButton } from "components/button"
import { PrettyHeader } from "components/pretty-defaults"
const X_PLAYER = "X"
const O_PLAYER = "O"

const Board = ({ currentBoard, onPlayerMove, disableButtons }) => {
    const square = i => {
        const player = currentBoard[i]
        return (
            <SquareButton
                onClick={() => onPlayerMove(i)}
                disabled={disableButtons || player ? true : false}
                aria-label={`TictacToe button # ${i}`}
                side="75px"
                style={{ margin: "4px", fontSize: "50px" }}
            >
                {player ? player : "."}
            </SquareButton>
        )
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <table>
                <tbody>
                    <tr>
                        <td>{square(0)}</td>
                        <td>{square(1)}</td>
                        <td>{square(2)}</td>
                    </tr>
                    <tr>
                        <td>{square(3)}</td>
                        <td>{square(4)}</td>
                        <td>{square(5)}</td>
                    </tr>
                    <tr>
                        <td>{square(6)}</td>
                        <td>{square(7)}</td>
                        <td>{square(8)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

const BoardStatus = ({ winnerIfAny, gameFinished, playerToMove }) => {
    let children = null
    if (gameFinished) {
        children = winnerIfAny ? `Winner: Player ${winnerIfAny} 🎉🥳` : `Nobody won.`
    } else {
        children = `Player ${playerToMove}, it's your turn!`
    }
    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <PrettyHeader style={{ fontSize: "30px", margin: "20px" }} Component={"div"}>
                {children}
            </PrettyHeader>
        </div>
    )
}

const RestartButton = ({ onRestart }) => {
    return (
        <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
            <DefaultButton
                disabled={!onRestart}
                useBgPrimaryColor={true}
                onClick={onRestart}
                aria-label="restart tictactoe game"
            >
                Restart!
            </DefaultButton>
        </div>
    )
}

const MoveHistory = ({ numberOfSnapshots, onLoadBoardSnapshot, currentSnapshotId }) => {
    const buttons = Array(numberOfSnapshots)
        .fill(null)
        .map((_, i) => (
            <SquareButton
                key={i}
                aria-label={`go to board state move # ${i}`}
                side="small"
                disabled={i === currentSnapshotId}
                onClick={() => onLoadBoardSnapshot(i)}
            >
                {i}
            </SquareButton>
        ))

    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    margin: "10px",
                    justifyContent: "center",
                }}
            >
                {buttons}
            </div>
        </>
    )
}

/*

    +---+---+---+
    | 0 | 1 | 2 |
    +---+---+---+
    | 3 | 4 | 5 |
    +---+---+---+
    | 6 | 7 | 8 |
    +---+---+---+

*/

const STREAKS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

// a board is a 9 element array representing the state of the board
// each element representing a square occupied by any of the ff: ['x', 'o', null]
const analyzeBoard = board => {
    // 1. check if there is a winning streak, and if so, which player, return
    for (const streak of STREAKS) {
        const [a, b, c] = streak.map(i => board[i])
        if (a !== null && a === b && b === c) {
            return { gameFinished: true, winnerIfAny: a, playerToMove: null }
        }
    }

    // 2. if no winning streak, check if the board has been fully occupied
    const occupiedSquaresLength = board.filter(x => x !== null).length
    if (occupiedSquaresLength === board.length) {
        return { gameFinished: true, winnerIfAny: null, playerToMove: null }
    }

    // 3. if the board is not fully occupied, check whose turn it is
    const playerToMove = occupiedSquaresLength % 2 === 0 ? X_PLAYER : O_PLAYER
    return { gameFinished: false, winnerIfAny: null, playerToMove }
}

const INITIAL_BOARD = [null, null, null, null, null, null, null, null, null]
const INITIAL_STATE = {
    boardSnapshots: [INITIAL_BOARD],
    currentSnapshotId: 0,
}

const App = () => {
    const [state, setState] = useStickyState(INITIAL_STATE, "hooks:tictactoe")

    // changing the state triggers a rerender
    // so we get to analyze the latest board each time
    const { currentSnapshotId, boardSnapshots } = state
    const currentBoard = boardSnapshots[currentSnapshotId]
    const { winnerIfAny, gameFinished, playerToMove } = analyzeBoard(currentBoard)
    const numberOfSnapshots = boardSnapshots.length

    const onPlayerMove = squareId => {
        // all occupied squares are disabled at this point
        // so when this callback is fired
        // it's safe to assume that this is a valid move
        // bottomline: no need to check.
        let nextBoard = currentBoard.slice()
        nextBoard[squareId] = playerToMove
        const nextBoardSnapshots = [
            ...boardSnapshots.slice(0, currentSnapshotId + 1),
            nextBoard,
        ]

        setState({
            boardSnapshots: nextBoardSnapshots,
            currentSnapshotId: currentSnapshotId + 1,
        })
    }

    const onLoadBoardSnapshot = snapShotId =>
        setState({ ...state, currentSnapshotId: snapShotId })

    const onRestart = () => setState(INITIAL_STATE)

    const restart = numberOfSnapshots === 1 ? null : onRestart
    return (
        <>
            <BoardStatus {...{ winnerIfAny, gameFinished, playerToMove }} />
            <Board {...{ currentBoard, onPlayerMove, disableButtons: gameFinished }} />
            <MoveHistory
                {...{ numberOfSnapshots, onLoadBoardSnapshot, currentSnapshotId }}
            />
            <RestartButton {...{ onRestart: restart }} />
        </>
    )
}

export default App
