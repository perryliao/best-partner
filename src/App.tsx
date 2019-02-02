import * as React from 'react';
import './App.css';
import {
	Collapse,
	Nav,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	NavItem,
	NavLink,
} from "reactstrap";
import {defaultDatabase, IDatabase, IPartner, IUser, partnerName, userName} from "./data/database";
import {ReactNode} from "react";
import {IContainerProps} from "./containers/Container";
import {CustomerCatalog} from "./containers/CustomerCatalog";
import {IProductInterface} from "./bestBuyAPIs/bestBuyAPIs";

enum page {
	PartnerPortalLogin,
	PartnerPortalSettings,
	PartnerCatalogueSettings,
	UserPortalLogin,
	UserPortalStore,
}

class App extends React.Component<IAppProps, IAppState> {

	public state: IAppState = {
		database: defaultDatabase,
		partnerKey: partnerName.RBC,
		userKey: userName.MICHELLE,
		isOpen: true,
		currentPage: page.PartnerPortalLogin,
	};

	private static pages: {[key: string]: {pointer: any, name: string}} = {
		[page.PartnerPortalLogin]: {pointer: CustomerCatalog, name: "Partner Login"},
		[page.PartnerPortalSettings]: {pointer: CustomerCatalog, name: "Partner Settings"},
		[page.PartnerCatalogueSettings]: {pointer: CustomerCatalog, name: "Partner Catalogue"},
		[page.UserPortalLogin]: {pointer: CustomerCatalog, name: "User Login"},
		[page.UserPortalStore]: {pointer: CustomerCatalog, name: "User Store"},
	};

	constructor(props: IAppProps) {
		super(props);
		this.loginUser = this.loginUser.bind(this);
		this.loginPartner = this.loginPartner.bind(this);
		this.toggle = this.toggle.bind(this);
		this.changePage = this.changePage.bind(this);
		this.createNavLinks = this.createNavLinks.bind(this);
		this.determinePage = this.determinePage.bind(this);
		this.addToCatalogue = this.determinePage.bind(this);
		this.removeFromCatalogue = this.removeFromCatalogue.bind(this);
	}

	private toggle(): void {
		this.setState({
			isOpen: !this.state.isOpen,
		});
	}

	private changePage(page: any): () => void {
		const that: App = this;
		return (): void => {
			that.setState({currentPage: page as page});
		};
	}

	private async loginUser(username: string, password: string): Promise<boolean> {
		const user: IUser = this.state.database.partners[this.state.partnerKey].users[username];
		const success: boolean = !(user === undefined || user.password !== password);
		if (!success) {
			return false;
		}
		const that: App = this;
		await new Promise((resolve: () => void) => {
			that.setState({userKey: username as userName}, resolve);
		});
		return success;
	}

	private async addToCatalogue(product: IProductInterface): Promise<void> {
		const database: IDatabase = JSON.parse(JSON.stringify(this.state.database));
		database.partners[this.state.partnerKey].catalogue[product.id] = product;
		await new Promise((resolve: () => void) => {
			this.setState({database}, resolve)
		});
	}

	private async removeFromCatalogue(product: IProductInterface): Promise<void> {
		const database: IDatabase = JSON.parse(JSON.stringify(this.state.database));
		try {
			delete database.partners[this.state.partnerKey].catalogue[product.id];
			await new Promise((resolve: () => void) => {
				this.setState({database}, resolve)
			});
		} catch (err) {

		}
	}

	private async loginPartner(username: string, password: string): Promise<boolean> {
		const partner: IPartner = this.state.database.partners[username];
		const success: boolean = !(partner === undefined || partner.password !== password);
		if (!success) {
			return false;
		}
		const that: App = this;
		await new Promise((resolve: () => void) => {
			that.setState({partnerKey: username as partnerName}, resolve);
		});
		return !(partner === undefined || partner.password !== password);
	}

	private createNavLinks(pageKey: any): ReactNode {
		return (
			<NavItem key={pageKey}>
				<NavLink
					onClick={this.changePage(pageKey)}
					href="#"
					selected={this.state.currentPage === pageKey}
				>
					{App.pages[pageKey].name}
				</NavLink>
			</NavItem>
		)
	}

	private determinePage(): ReactNode {
		const props: IContainerProps = {
			loginUser: this.loginUser,
			loginPartner: this.loginPartner,
			addToCatalogue: this.addToCatalogue,
			removeFromCatalogue: this.removeFromCatalogue,
			database: this.state.database,
			partnerKey: this.state.partnerKey,
			userKey: this.state.userKey,
		};
		return React.createElement(App.pages[this.state.currentPage].pointer, props);
	}

	public render() {
		const keys = Object.keys(page)
			.filter(k => typeof page[k as any] === "number"); // ["A", "B"]
		const links: any[] = keys.map(k => page[k as any]); // [0, 1]

		return (
			<div className="App">
				<Navbar color="dark" dark={true} expand="md">
					<NavbarBrand href="#">{this.state.partnerKey}</NavbarBrand>
					<NavbarToggler onClick={this.toggle}/>
					<Collapse isOpen={this.state.isOpen} navbar={true}>
						<Nav className="ml-auto" navbar={true}>
							{links.map(this.createNavLinks)}
						</Nav>
					</Collapse>
				</Navbar>
				<div className="container">
					{this.determinePage()}
				</div>
			</div>
		);
	}
}

interface IAppProps {

}

interface IAppState {
	database: IDatabase,
	partnerKey: partnerName,
	userKey: userName,
	isOpen: boolean;
	currentPage: page;
}

export default App;
