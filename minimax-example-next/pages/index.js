import React, { useState } from "react"

import Head from "next/head"

export default function Home({repos}) {
	const [open, setOpen] = useState(null);

    return (
        <>
            <Head>
                <title>Minimax Tic-Tac-Toe</title>
            </Head>
            <div id="root">
                <div className="minimax-wrapper">
                    <table id="tab-tic-tac-toe" cellspacing="0">
                        <tr>
                            <td id="00" onclick="clickedCell(this)"></td>
                            <td id="01" onclick="clickedCell(this)"></td>
                            <td id="02" onclick="clickedCell(this)"></td>
                        </tr>
                        <tr>
                            <td id="10" onclick="clickedCell(this)"></td>
                            <td id="11" onclick="clickedCell(this)"></td>
                            <td id="12" onclick="clickedCell(this)"></td>
                        </tr>
                        <tr>
                            <td id="20" onclick="clickedCell(this)"></td>
                            <td id="21" onclick="clickedCell(this)"></td>
                            <td id="22" onclick="clickedCell(this)"></td>
                        </tr>
                    </table>
                    <div className="control-wrapper">
                        <input type="button" value="Start AI" id="bnt-restart" />
                        <button type="button" className="information-btn" onClick={(e) => setOpen(true)}>
                            ?
                        </button>
                    </div>
                </div>
            </div>
            <div className={open == true ? "modal open" : "modal"}>
                <div className="modal-inner">
                    <div className="modal-header">
                        <div className="modal-title">
							<h2 className="title">{repos.name}</h2>
						</div>
                        <div className="modal-close" onClick={(e) => setOpen(false)}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM12.59 6L10 8.59L7.41 6L6 7.41L8.59 10L6 12.59L7.41 14L10 11.41L12.59 14L14 12.59L11.41 10L14 7.41L12.59 6Z" fill="black" />
                            </svg>
                        </div>
                    </div>
                    <div className="modal-body"></div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps({ previewData }) {
	const res = await fetch("https://api.github.com/repos/hrbang/Minimax-algorithm-PY")
	const repos = await res.json()

	return {
		props: {
			repos: repos,
		},
	}
}
