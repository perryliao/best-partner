import * as React from "react";
import {ReactNode} from "react";

abstract class Container<P extends IContainerProps = IContainerProps, S extends IContainerState = IContainerState> extends React.PureComponent<P, S> {

	public static defaultProps: IContainerProps = {

	};

	private readonly childRender: () => ReactNode;

	protected constructor(props: P) {
		super(props);

		this.wrapRender = this.wrapRender.bind(this);

		// @ts-ignore
		this.state = {

		};

		this.childRender = this.render;
		this.wrapRender();
	}
	private wrapRender(): void {
		this.render = (): ReactNode => {
			return (
				<div>
					<div>
						{this.childRender()}
					</div>
				</div>
			);
		};
	}
}

interface IContainerProps {

}

interface IContainerState {

}

export {Container, IContainerState, IContainerProps};