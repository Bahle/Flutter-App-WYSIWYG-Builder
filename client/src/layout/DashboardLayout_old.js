import React, { Component } from 'react';
import logo from '../logo.svg';
import '../css/Layout.css';
import { Layout, Menu, Icon, Card, Col, Badge, Breadcrumb } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import UserProfile from '../UserProfile';
import axios from 'axios';
import { SERVER_URL } from '../constants';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const MenuItemGroup = Menu.ItemGroup;

const apiKey = '-beWSq47TuufC_mSV0rD6Q==';

class DashboardLayout extends Component {
	state = {
		loggedIn: UserProfile.getName() !== null
	}
	
	pages = [{
		link: '/',
		text: 'Home',
		icon: undefined
	},
	/*{
		text: 'Clients',
		icon: undefined
	},
	{
		text: 'Messages',
		icon: undefined
	},
	{
		text: 'Payments',
		icon: undefined
	},
	{
		text: 'Contacts',
		icon: undefined
	},
	{
		text: 'Groups',
		icon: undefined
	},
	{
		text: 'Credits Remaining',
		icon: undefined,
		float: 'right',
		badge: {
			count: UserProfile.getCredits(),
			style: {
				backgroundColor: UserProfile.getCredits() < 20 ? 'red' : '#52c41a'
			}
		},
		submenu: [{
			content: [
				{
					link: UserProfile.getPrivileges() == 2 ? 'https://portal.clickatell.com/#/billing/top-up' : '/payments/new',
					text: 'Top up credits',
					icon: undefined
				}
			]
		}]
	}*/]	

	selectedMenuItem = [];

	componentWillMount() {
		
	}

	componentDidMount() {

	}

	render() {
		/*if (this.state.loggedIn === false) {
		  alert('User not signed in. Redirecting to the login page.');

		  return <Redirect to='/sign-in' />
		}*/

		var folders = window.location.pathname;
		// remove starting /
		if(folders[0] === '/') folders = folders.substring(1, folders.length);

		// remove ending / if any
		if(folders[folders.length-1] === '/') folders = folders.substring(0, folders.length-1);
		folders = folders.split('/');

		var fullPath = (this.props.Root == '' || this.props.Root === undefined ? '' : '/' + this.props.Root);

		return(
			<Layout>
			  <Header style={{ position: 'fixed', width: '100%', background: 'white' }}>
			    <div className="logo" />
			    
			    <Menu
			      mode="horizontal"
			      defaultSelectedKeys={this.selectedMenuItem[0]}
			      style={{ lineHeight: '64px' }}
			    >

				  <SubMenu
				  	  className="sm-visible"
	  			  	  style={{ float: 'right' }}
			          title={
  			            <span>
  			        		<Icon type={"home"} />
		              		{ UserProfile.getFullName() }
		              	</span>}>
		          	{/* <Menu.Item key="99"><Link to="/profile"> My Profile </Link></Menu.Item> */ }
		          	<Menu.Item key="100"><Link to="/logout"> Log Out </Link></Menu.Item>
			      </SubMenu>

  			            

				  {
				  	this.pages.map((page,index) => {
				  		if(page.submenu === undefined) {
				  			return (<Menu.Item key={index} style={{ float: page.float || 'left' }}>
				  				{ page.badge === undefined ?
				  					<Link to={page.link}><Icon type={page.icon || "home"} /> {page.text}</Link> :
				  					<Badge count={page.badge.count} showZero  overflowCount={99999}>
								  		<Link to={page.link}><Icon type={page.icon || "home"} /> {page.text}</Link>
								  	</Badge>
				  				}
				  			</Menu.Item>)
				  		} else {
				  			return (<SubMenu
				  			  style={{ float: page.float || 'left' }}
		  			          title={ page.badge === undefined ?
			  			            <span>
			  			        		<Icon type={page.icon || "home"} />
		  			              		{page.text}
		  			              	</span> :
			  			            <Badge count={page.badge.count} style={page.badge.style} showZero overflowCount={999}>
			  			            	<Icon type={page.icon || "home"} />
			  			             	{page.text}
				  			        </Badge>
		  			          }
		  			        
		  			        >
		  			          {
		  			          	page.submenu.map(submenu => {
		  			          		if(submenu.text === undefined) {
		  			          			return submenu.content.map((content, index) => {
			  			          				return (<Menu.Item key={`${content.text}${index}`}><Link to={content.link}>{content.text}</Link></Menu.Item>)
			  			          			})
		  			          		} else {
		  			          			return (<Menu.ItemGroup title={submenu.text}>
					  			        	{
					  			        		submenu.content.map((content, index) => {
					  			        			return (<Menu.Item key={`${content.text}${index}`}><a href={content.link}>{content.text}</a></Menu.Item>)
					  			        		})
					  			        	}
					  			        </Menu.ItemGroup>)
					  			    }
		  			          	}) 
		  			          }
		  			        </SubMenu>)
				  		}
				  	})
				  }
				  
			    </Menu>
			    
			  </Header>
			  <Content style={{ padding: '20px 0px', marginTop: 64 }}>
			  	  <Col xs={{ span:24, offset: 0 }} sm={{ span:24, offset: 0 }} lg={{ span:16, offset: 4 }} md={{ span:20, offset: 2 }}>
			  		 <Card title={this.props.title} style={{ width: '100%' }}>
			  			<Breadcrumb>
			  				<Breadcrumb.Item><Link to={`/${this.props.Root}`}><Icon type="home" /> Home</Link></Breadcrumb.Item>
			  				{
			  					folders.map((item, index) => {
			  						if(item == 'a' || item == 'v' || item == 'e' || !isNaN(item)) return;

			  						fullPath += '/' + item;

			  						if((index+1) != folders.length) {
			  							// ignore if Root because it is already displayed by default
			  							if(item != this.props.Root) {
			  								console.log('fullPath is: ' + fullPath);
			  								// Uppercase first letter
			  								return <Breadcrumb.Item><Link to={fullPath}> {item[0].toUpperCase() + item.substr(1, item.length)}</Link></Breadcrumb.Item>
			  							}
			  						} else {
			  							return <Breadcrumb.Item>{item[0].toUpperCase() + item.substr(1, item.length)}</Breadcrumb.Item>
			  						}
			  					})
			  				}
			  			</Breadcrumb>
			  			<br/>
			  			{this.props.children}
			  		</Card>
			  	  </Col>
		      </Content>

		      <Footer style={{ textAlign: 'center' }}>
		        SMS System ©2019
		      </Footer>
		    </Layout>
		)
	}
}

DashboardLayout.defaultProps = {
	Root: ''
}

export default DashboardLayout;