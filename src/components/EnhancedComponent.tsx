import * as React from "react";
import {ReactNode} from "react";

abstract class EnhancedComponent<P extends IEnhancedComponentProps = IEnhancedComponentProps, S extends IEnhancedComponentState = IEnhancedComponentState> extends React.PureComponent<P, S> {

	public static defaultProps: IEnhancedComponentProps = {

	};

	private readonly childRender: () => ReactNode;

	protected wrapRenderDivClassName: string;

	protected constructor(props: P) {
		super(props);
		// @ts-ignore
		this.state = {};

		this.childRender = this.render;
		this.wrapRender = this.wrapRender.bind(this);
		this.wrapRender();
	}

	private wrapRender(): void {
		this.render = (): ReactNode => {
			return (
				<div className={this.wrapRenderDivClassName}>
					{this.childRender()}
				</div>
			);
		};
	}
}

interface IEnhancedComponentProps {

}

interface IEnhancedComponentState {

}

export {EnhancedComponent, IEnhancedComponentState, IEnhancedComponentProps};
