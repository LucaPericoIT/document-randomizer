import React, {ReactFragment} from "react";

interface props {
    style: string,
    text: ReactFragment
}

export default class Notification extends React.Component<props, unknown> {
    constructor(props: props) {
        super(props);
    }

    render() {
        return <p className={"note " + this.props.style}>{this.props.text}</p>
    }
}
