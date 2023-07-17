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

class DashboardLayout extends Component {
	state = {
		loggedIn: UserProfile.getName() !== null
	}
	
	pages = [{
		link: '/',
		text: 'Home',
		icon: undefined
	}]	

	selectedMenuItem = [];

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
				  
				  {/*<Menu.Item key="2"><Link to="/receive"><Icon type="database" /> Clients</Link></Menu.Item>
			      <Menu.Item key="3"><Link to="/distributions"><Icon type="shopping-cart" /> Messages</Link></Menu.Item>
				  {  UserProfile.getPrivileges() >= 2 ? <Menu.Item key="4"><Link to="/input"><Icon type="desktop" /> Input</Link></Menu.Item> : <span></span> }
				  <Menu.Item key="5"><Link to="/reports"><Icon type="shop" /> Reports</Link></Menu.Item>
			      
			      { UserProfile.getPrivileges() == 3 ? <Menu.Item key="6"><Link to="/admin"><Icon type="setting" /> Admin</Link></Menu.Item> : <span></span> }*/}
			    </Menu>
			    
			  </Header>
			  <Content style={{ padding: '20px 0px', marginTop: 64 }}>
			  	  <Col xs={{ span:24, offset: 0 }} sm={{ span:24, offset: 0 }} md={{ span:20, offset: 2 }}>
			  		 <Card title={this.props.title} style={{ width: '100%' }} extra={this.props.extra} tabList={this.props.tabList} 
			  		 onTabChange={key => {
			            this.props.onTabChange(key, 'key');
			          }}>
			  			{this.props.children}
			  		</Card>
			  	  </Col>
		      </Content>

		      <Footer style={{ textAlign: 'center' }}>
		        AutomataGui System <script>document.write(new Date().getYear() + 1900)</script>
		      </Footer>
		    </Layout>
		)
	}
}

DashboardLayout.defaultProps = {
	Root: ''
}

export default DashboardLayout;