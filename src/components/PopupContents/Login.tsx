import * as React from "react";
import {ReactNode} from "react";
import {EnhancedComponent, IEnhancedComponentProps, IEnhancedComponentState} from "../EnhancedComponent";
import {TextInput} from "../TextInput";
import {Button} from "reactstrap";
import "../../App.css";
import {Container} from "../../containers/Container";

class Login extends EnhancedComponent<ILoginProps, ILoginState> {

	public static defaultProps: ILoginProps = {
		...EnhancedComponent.defaultProps,
	};

	private name: string;
	private password: string;

	protected constructor(props: ILoginProps) {
		super(props);
		this.state = {
			...this.state,
		};

		this.handleLogin = this.handleLogin.bind(this);
		this.saveName = this.saveName.bind(this);
		this.savePassword = this.savePassword.bind(this);
	}

	private handleLogin(callback: () => void): () => void {
		return(() => {
			// validate...
			let attempt: boolean = false;
			if (!attempt) {
				// retry login
				console.log(attempt);
				if (this.name && this.password && this.props.login) {
					console.log(this.name, this.password);
					this.props.login(this.name, this.password)
						.then((res: any) => {
							attempt = !res;
						})
				}
			}
			callback();
		});
	}

	private saveName(event: any): void {
		this.name = event;
	}

	private savePassword(event: any): void {
		this.password = event;
	}

	public render(): ReactNode {
		return (
			<div className={"CenterAllColumn"}>
				<img src={"rbc_icon.png"}/>
				<p className={"BestBuyBlack popupHeaderText"}>Login to RBC</p>
				<TextInput inputProps={{onChange: this.saveName}} placeholder={"Name"}/>
				<TextInput inputProps={{onChange: this.savePassword}} placeholder={"Password"} secureText={true}/>
				<div style={{height: 15}}/>
				<Button className={"jerryButton"} onClick={this.handleLogin(this.props.onClick)} >Login</Button>{' '}
			</div>
		);
	}
}

interface ILoginProps extends IEnhancedComponentProps {
	onClick?: () => void;
	login?: (username: string, password: string) => Promise<boolean>;
}

interface ILoginState extends IEnhancedComponentState {

}

export {Login, ILoginProps, ILoginState};
