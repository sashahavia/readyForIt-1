import React, { Component } from 'react';

import {slide as Menu} from 'react-burger-menu';

import '../css/SideBar.css';


class SideBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            showSignUp: props,
            menuOpen: false
        }
    }

    handleStateChange (state) {
        this.setState({menuOpen: state.isOpen})  
    }
      
    // This can be used to close the menu, e.g. when a user clicks a menu item
    handleClick(){
        this.setState({showSignUp: true}); 
        this.setState({menuOpen: false});
        
    }
    render (state) {
        return (
            <Menu 
                className="menu"
                isOpen={this.state.menuOpen}
                onStateChange={(state) => this.handleStateChange(state)}
            >
                <h1>ReadyForIt</h1>
                <button className="btn2" id="weather"><i className="fa fa-fw fa-cloud"></i><span>Weather Updates</span></button>
                <button className="btn2" id="donations" href=""><i className="fa fa-fw fa-ambulance"></i><span>Donations</span></button>
                <button className="btn2"id="people-say" href=""><i className="fa fa-fw fa-comments"></i><span>People Say</span></button>
                <button className="btn2"id="statistics" href=""><i className="fa fa-fw fa-history"></i><span>Statistics</span></button>
                
                <div id="social">
                    <a href="/" className="fa fa-fw fa-facebook"></a>
                    <a href="/" className="fa fa-fw fa-twitter"></a>
                    <a href="/" className="fa fa-fw fa-instagram"></a>
                    <p>Copyright @ 2018 ReadyForIt. All rights reserved.</p>
                </div>
            </Menu>
        );
    }
}

export default SideBar;