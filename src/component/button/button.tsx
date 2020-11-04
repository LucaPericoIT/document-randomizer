import React from "react";

interface props {
    style: string,
    action: () => void,
    text: any
    disabled: boolean,
}

export default class Button extends React.Component<props, unknown> {
    static defaultProps = {
        disabled: false
    }

    constructor(props: props) {
        super(props);
    }

    render() {
        return <button className={"btn " + this.props.style}
                       onClick={this.props.action} disabled={this.props.disabled}>{this.props.text}</button>

    }
}
