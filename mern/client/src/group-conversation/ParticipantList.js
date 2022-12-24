import React, { Component } from 'react';
import {Button, Form, Icon, Input,Typography} from "antd";
import PropTypes from "prop-types";
const { Text } = Typography;


class ParticipantList extends Component {
  constructor(props) {
    super(props);

  }


  render = () => {
    const participantList=this.props.participantList
    return (
       <div>
        <div >Participant List</div>
        {
          participantList.map((item)=>{
            return (
            <div>
              {item.identity}
            </div>

             )
          })
        }
       </div>
    );
  }
}


export default ParticipantList;