import React, { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkLint from "remark-lint"
import remarkGfm from "remark-gfm"
import Head from "next/head"
import Link from "next/link"

export default function Home() {
    const [markdown, setMarkdown] = useState("")

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
                                    <td id="00" />
                                    <td id="01" />
                                    <td id="02" />
                                </tr>
                                <tr>
                                    <td id="10" />
                                    <td id="11" />
                                    <td id="12" />
                                </tr>
                                <tr>
                                    <td id="20" />
                                    <td id="21" />
                                    <td id="22" />
                                </tr>
                            </tbody>
                        </table>
                        <div className="control-wrapper">
                            <input type="button" value="Start AI" id="bnt-restart" />
                        </div>
                    </div>
                    <div className="description">
                        <div className="desc-inner">
                            <div className="markdown-body">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
                                <p className="link">Check out the repository <Link href="https://github.com/hrbang/Minimax-algorithm-WEB"><a>Here</a></Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}