import React from "react";

interface props {
    value: string,
    disable: boolean,
    key: string
}

export default class File extends React.Component<props, unknown> {

    constructor(props: props) {
        super(props);
    }

    render() {
        return <div className={"input-group mb-3 file-form"}>
            <span className={"input-group-text"}>file</span>
            <input type={"text"} className={"form-control"}
                   disabled={this.props.disable}
                   value={this.props.value}
                   readOnly={true}/>
        </div>;

    }
}
