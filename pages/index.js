import React, { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Head from "next/head"
import Link from "next/link"

export default function Home() {
    const [markdown, setMarkdown] = useState("")
    const [isOpen, setIsOpen] = useState(null)
    const [isDraw, setIsDraw] = useState(null)
    const [isLose, setIsLose] = useState(null)
    const [isHovered, setIsHovered] = useState(null)

    var HUMAN = -1
    var COMP = +1

    var board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ]

    const evalute = (state) => {
        var score = 0

        if (gameOver(state, COMP)) {
            score = +1
        } else if (gameOver(state, HUMAN)) {
            score = -1
        } else {
            score = 0
        }

        return score
    }

    const gameOver = (state, player) => {
        var win_state = [
            [state[0][0], state[0][1], state[0][2]],
            [state[1][0], state[1][1], state[1][2]],
            [state[2][0], state[2][1], state[2][2]],
            [state[0][0], state[1][0], state[2][0]],
            [state[0][1], state[1][1], state[2][1]],
            [state[0][2], state[1][2], state[2][2]],
            [state[0][0], state[1][1], state[2][2]],
            [state[2][0], state[1][1], state[0][2]],
        ]

        for (var i = 0; i < 8; i++) {
            var line = win_state[i]
            var filled = 0
            for (var j = 0; j < 3; j++) {
                if (line[j] == player) filled++
            }
            if (filled == 3) return true
        }
        return false
    }

    const gameOverAll = (state) => {
        return gameOver(state, HUMAN) || gameOver(state, COMP)
    }

    const emptyCells = (state) => {
        var cells = []
        for (var x = 0; x < 3; x++) {
            for (var y = 0; y < 3; y++) {
                if (state[x][y] == 0) cells.push([x, y])
            }
        }

        return cells
    }

    const validMove = (x, y) => {
        var empties = emptyCells(board)
        try {
            if (board[x][y] == 0) {
                return true
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    }

    const setMove = (x, y, player) => {
        if (validMove(x, y)) {
            board[x][y] = player
            return true
        } else {
            return false
        }
    }

    const minimaxAlgorithm = (state, depth, player) => {
        var best

        if (player == COMP) {
            best = [-1, -1, -1000]
        } else {
            best = [-1, -1, +1000]
        }

        if (depth == 0 || gameOverAll(state)) {
            var score = evalute(state)
            return [-1, -1, score]
        }

        emptyCells(state).forEach(function (cell) {
            var x = cell[0]
            var y = cell[1]
            state[x][y] = player
            var score = minimaxAlgorithm(state, depth - 1, -player)
            state[x][y] = 0
            score[0] = x
            score[1] = y

            if (player == COMP) {
                if (score[2] > best[2]) best = score
            } else {
                if (score[2] < best[2]) best = score
            }
        })

        return best
    }

    const aiTurn = () => {
        var x, y
        var move
        var cell

        if (emptyCells(board).length == 9) {
            x = parseInt(Math.random() * 3)
            y = parseInt(Math.random() * 3)
        } else {
            move = minimaxAlgorithm(board, emptyCells(board).length, COMP)
            x = move[0]
            y = move[1]
        }

        if (setMove(x, y, COMP)) {
            cell = document.getElementById(String(x) + String(y))
            cell.innerHTML = "O"
        }
    }

    const clickedCell = (e) => {
        var button = document.getElementById("bnt-restart")
        button.disabled = true
        var conditionToContinue = gameOverAll(board) == false && emptyCells(board).length > 0

        if (conditionToContinue == true) {
            var x = e.target.id.split("")[0]
            var y = e.target.id.split("")[1]
            var move = setMove(x, y, HUMAN)
            if (move == true) {
                e.target.innerHTML = "X"
                if (conditionToContinue) aiTurn()
            }
        }
        if (gameOver(board, COMP)) {
            var lines
            var cell

            if (board[0][0] == 1 && board[0][1] == 1 && board[0][2] == 1)
                lines = [
                    [0, 0],
                    [0, 1],
                    [0, 2],
                ]
            else if (board[1][0] == 1 && board[1][1] == 1 && board[1][2] == 1)
                lines = [
                    [1, 0],
                    [1, 1],
                    [1, 2],
                ]
            else if (board[2][0] == 1 && board[2][1] == 1 && board[2][2] == 1)
                lines = [
                    [2, 0],
                    [2, 1],
                    [2, 2],
                ]
            else if (board[0][0] == 1 && board[1][0] == 1 && board[2][0] == 1)
                lines = [
                    [0, 0],
                    [1, 0],
                    [2, 0],
                ]
            else if (board[0][1] == 1 && board[1][1] == 1 && board[2][1] == 1)
                lines = [
                    [0, 1],
                    [1, 1],
                    [2, 1],
                ]
            else if (board[0][2] == 1 && board[1][2] == 1 && board[2][2] == 1)
                lines = [
                    [0, 2],
                    [1, 2],
                    [2, 2],
                ]
            else if (board[0][0] == 1 && board[1][1] == 1 && board[2][2] == 1)
                lines = [
                    [0, 0],
                    [1, 1],
                    [2, 2],
                ]
            else if (board[2][0] == 1 && board[1][1] == 1 && board[0][2] == 1)
                lines = [
                    [2, 0],
                    [1, 1],
                    [0, 2],
                ]

            for (var i = 0; i < lines.length; i++) {
                cell = document.getElementById(String(lines[i][0]) + String(lines[i][1]))
                cell.style.color = "red"
            }

            setIsLose(true)
            setIsOpen(true)
        }
        if (emptyCells(board).length == 0 && !gameOverAll(board)) {
            setIsDraw(true)
            setIsOpen(true)
        }
        if (gameOverAll(board) == true || emptyCells(board).length == 0) {
            button.value = "Restart"
            button.disabled = false
        }
    }

    const restartGame = (e) => {
        if (e.target.value == "Start AI") {
            aiTurn()
            e.target.disabled = true
        } else if (e.target.value == "Restart") {
            var htmlBoard

            for (var x = 0; x < 3; x++) {
                for (var y = 0; y < 3; y++) {
                    board[x][y] = 0
                    htmlBoard = document.getElementById(String(x) + String(y))
                    htmlBoard.style.color = "#444"
                    htmlBoard.innerHTML = ""
                }
            }
            e.target.value = "Start AI"
        }
    }

    const restartGameRefresh = (e) => {
        window.location.reload(true)
    }

    useEffect(() => {
        import(`../public/Readme.md`)
            .then((res) => {
                setMarkdown(res.default)
            })
            .catch((err) => console.log(err))
    })

    return (
        <>
            <Head>
                <title>Minimax Tic-Tac-Toe</title>
            </Head>
            <div id="root">
                <div className="content">
                    <div className="minimax-wrapper">
                        <table id="tab-tic-tac-toe" cellSpacing="0">
                            <tbody>
                                <tr>
                                    <td onClick={(e) => clickedCell(e)} id="00" />
                                    <td onClick={(e) => clickedCell(e)} id="01" />
                                    <td onClick={(e) => clickedCell(e)} id="02" />
                                </tr>
                                <tr>
                                    <td onClick={(e) => clickedCell(e)} id="10" />
                                    <td onClick={(e) => clickedCell(e)} id="11" />
                                    <td onClick={(e) => clickedCell(e)} id="12" />
                                </tr>
                                <tr>
                                    <td onClick={(e) => clickedCell(e)} id="20" />
                                    <td onClick={(e) => clickedCell(e)} id="21" />
                                    <td onClick={(e) => clickedCell(e)} id="22" />
                                </tr>
                            </tbody>
                        </table>
                        <div className="control-wrapper">
                            <input type="button" value="Start AI" id="bnt-restart" onClick={(e) => restartGame(e)} />
                            <input type="button" value="How it works?" id="bnt-how" onClick={(e) => restartGame(e)} />
                        </div>
                    </div>
                    <div className="description">
                        <div className="desc-inner">
                            <div className="markdown-body">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
                                <p className="link">
                                    Check out the repository{" "}
                                    <Link href="https://github.com/hrbang/Minimax-algorithm-WEB">
                                        <a>Here</a>
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={isOpen == true ? "modal is-open" : "modal"}>
                    <div className="modal-inner">
                        <div className="modal-body">
                            <div className="modal-body-inner">
                                <div className="body-icon">
                                    {isDraw == true && (
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.75 12.25L14.25 3.75V1.75H12.25L3.75 10.25M2.75 9.25L4.25 11.75L6.25 13.25L2.75 9.25ZM1.75 13.25L2.75 14.25L1.75 13.25ZM4.25 11.75L2.75 13.25L4.25 11.75Z" stroke="#181616" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M6 8L1.75 3.75V1.75H3.75L8 6M10.25 12.25L8 10L10.25 12.25ZM10 8L12.25 10.25L10 8ZM13.25 9.25L11.75 11.75L9.75 13.25L13.25 9.25ZM14.25 13.25L13.25 14.25L14.25 13.25ZM11.75 11.75L13.25 13.25L11.75 11.75Z" stroke="#181616" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    )}
                                    {isLose == true && (
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 12L16 16" stroke="#181616" stroke-width="2" stroke-linecap="round" />
                                            <path d="M12 12L8 8" stroke="#181616" stroke-width="2" stroke-linecap="round" />
                                            <path d="M12 12L8 16" stroke="#181616" stroke-width="2" stroke-linecap="round" />
                                            <path d="M12 12L16 8" stroke="#181616" stroke-width="2" stroke-linecap="round" />
                                            <path d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z" stroke="#181616" stroke-width="2" stroke-linecap="round" />
                                        </svg>
                                    )}
                                </div>
                                <div className="body-text">
                                    <h2 className="text">
                                        {isLose == true && "The AI wins, you lost"}
                                        {isDraw == true && "The game is draw!"}
                                    </h2>
                                </div>
                                <div className="modal-restart">
                                    <button type="button" className="restart" onClick={(e) => restartGameRefresh(e)}>
                                        Restart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
