import React, {Fragment} from "react";
import {requestFileCreation, requestOpenDialog} from "../../ipc/out";
import File from "../file/file";
import Button from "../button/button";
import Notification from "../notification/notification";


interface state {
    pristine: boolean,
    working: boolean,
    files: string[]
    clones: number
    success: boolean
    doneNotification: boolean,
    message: string
}

export default class Main extends React.Component<unknown, state> {
    controller = new AbortController();

    constructor(props: unknown) {
        super(props)
        this.state = {
            pristine: false,
            working: false,
            files: [],
            clones: 1,
            success: true,
            doneNotification: false,
            message: "",
        }
    }

    componentWillUnmount = () => {
        this.controller.abort()
    }

    selectFiles = () => {
        requestOpenDialog().then(f => {
            this.setState({
                pristine: true,
                files: f,
                doneNotification: false
            })
        })
    }

    createFiles = () => {
        this.setState({
            working: true,
        })

        requestFileCreation(this.state.files, this.state.clones).then(r => {
            this.setState({
                success: true,
                message: r,
            })
        }).catch((err) => {
            this.setState({
                success: false,
                message: err,
            })
        }).finally(() => {
            this.setState({
                working: false,
                doneNotification: true,
            })
        })
    }

    clean = () => {
        this.setState({
            pristine: false,
            files: [],
            doneNotification: false,
        })
    }

    render() {
        const files = []

        for (const value of this.state.files) {
            files.push(<File disable={false} value={value} key={value}/>)
        }

        return <div>
            <div className="card" id="file-selection-card">
                <div className="card-body">
                    <h5 className="card-title">Random files generator</h5>
                    <div id="form">
                        {files}
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default"> # of clones</span>
                            <input type="number" className="form-control" id="count" defaultValue={this.state.clones}/>
                        </div>
                    </div>
                    <div className="text-center">
                        {!this.state.working && !this.state.pristine &&
                        <Button style={"btn-outline-success"} action={this.selectFiles} text={"Select files"}/>}
                        {!this.state.working && this.state.pristine &&
                        <Button style={"btn-outline-success"} action={this.createFiles} text={"Create files"}/>}
                        {this.state.working &&
                        <Button style={"btn-success"} action={this.createFiles}
                                text={<span className="spinner-border spinner-border-sm" role="status"
                                            aria-hidden="true"/>}
                                disabled={true}/>}

                        {this.state.pristine &&
                        <Button style={"btn-outline-danger"} action={this.clean} text={"Clean"}/>}
                    </div>
                </div>
            </div>
            <br/>
            {this.state.doneNotification && this.state.success && <Notification style={"note-success"}
                                                                                text={<Fragment><strong> All files have
                                                                                    been created: </strong> you can find
                                                                                    them
                                                                                    at {this.state.message}
                                                                                </Fragment>}/>}

            {this.state.doneNotification && !this.state.success && <Notification style={"note-danger"}
                                                                                 text={<Fragment><strong> An error
                                                                                     occurred: </strong> verify logs for
                                                                                     more details
                                                                                 </Fragment>}/>}
        </div>
    }
}