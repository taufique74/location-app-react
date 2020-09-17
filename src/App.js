import React, { Component } from 'react';
import { GoogleApiWrapper, Marker } from 'google-maps-react';
import CurrentLocation from './Map';
import Modal from 'react-modal';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const customStyles = {
  content: {
    top: '35%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: '30%',
    transform: 'translate(-40%, -10%)',
  },
};

Modal.setAppElement('#root');
export class MapContainer extends Component {
  constructor(){
    super();
    this.state = {
      // showingInfoWindow: false, // hides or shows the InfoWindow
      activeMarker: {}, // shows the active marker upon click
      name: '',
      modalIsOpen: false,
      currentLocation: {}
    }

    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
          const coords = pos.coords;
          this.setState({
              currentLocation: {
                  lat: coords.latitude,
                  lng: coords.longitude
              }
          });
      });
    }

  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      modalIsOpen: true
    });
  }

  handleSubmit = (event) => {
    console.log(JSON.stringify({
      currentLocation: this.state.currentLocation,
      name: this.refs.name.value
    }));
    event.preventDefault();
    this.closeModal();
  }


  render() {
    return (
      <CurrentLocation
        centerAroundCurrentLocation
        google={this.props.google}
      >
        <Marker
          onClick={this.onMarkerClick}
          name={'My Current Location'}
        />
        <Modal 
          isOpen={this.state.modalIsOpen} 
          onRequestClose={this.closeModal}
          style={customStyles}
        >
          <h2>Share your Location & Name</h2>
          <Form.Group>
            <Form.Control type="text" value={this.state.currentLocation.lat+', '+this.state.currentLocation.lng} />
          </Form.Group>
          <Form.Group>
            <Form.Control type="text" placeholder="Enter Your Name" ref="name" />
          </Form.Group>
          <Button variant="primary" onClick={this.handleSubmit}>Submit</Button>
        </Modal>
      </CurrentLocation>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLEMAPS_API
})(MapContainer);