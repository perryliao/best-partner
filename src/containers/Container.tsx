import * as React from "react";
import {ReactNode} from "react";
import {IPopupReqs, Popup} from "../components/Popup";

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
			const test = this.props.modalFunction(PopupModalsEnum.LOGIN);
			return (
				<div>
					<p onClick={test.toggleFn}>
						Click me
					</p>
					<div>
						{this.childRender()}
					</div>
				</div>
			);
		};
	}
}

interface IContainerProps {
	loginUser?: (username: string, password: string) => Promise<boolean>;
	loginPartner?: (username: string, password: string) => Promise<boolean>;
	modalFunction?: (key: PopupModalsEnum) => IPopupReqs;
}

interface IContainerState {

}

enum PopupModalsEnum {
	LOGIN,
	BALANCE,
	PROCESSING,
	DONE,
}

export {Container, IContainerState, IContainerProps, PopupModalsEnum};
