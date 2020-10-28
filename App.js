import React from 'react';
import MapView, { Callout, Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, TextInput } from 'react-native';
import { SearchBar } from 'react-native-elements';
import axios from 'axios';
// import Geolocation from '@react-native-community/geolocation';

export default class App extends React.Component {
  // NEED STATE TO HOLD STUFF
  constructor(props) {
    super(props);
    this.state = {
      position: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      search: '',
    };
  }

  // BUILD A ONCLICK FUNCTION FOR WHEN THE MARKER IS CLICKED

  // SHOULD HAPPEN WITH COMPONENT DID MOUNT
  componentDidMount() {
    // A FUNCTION THAT SENDS LONGITUDE AND LATITUDE TO BACKEND THAT RECEIVES LIST OF RESTAURANTS THAT MAPS IT INTO MARKER JSX FORMAT INTO AN ARRAY
    navigator.geolocation.getCurrentPosition((position) => {
      console.log('current position: ', position);
      console.log('latitude: ', position['coords']['latitude']);
      let newPosition = {
        latitude: position['coords']['latitude'],
        longitude: position['coords']['longitude'],
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      this.setState({ position: newPosition });
    });
    // axios
    //   .post('192.168.1.127:19000/api', {
    //     latitude: this.state.position.latitude,
    //     longitude: this.state.position.longitude,
    //   })
    //   .then(() => console.log('Position was sent to server!'))
    //   .catch((err) =>
    //     console.log('ERROR IN COMPONENT DID MOUNT > AXIOS > POST ERROR: ', err)
    //   );
    fetch('https://localhost:3333/api/getAll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude: this.state.position.latitude,
        longitude: this.state.position.longitude,
      }),
    })
      .then((data) => data.json())
      .then((result) => console.log(result))
      .catch((err) =>
        console.log('ERROR IN COMPONENT DID MOUNT > FETCH > POST ERROR: ', err)
      );
  }

  componentDidUpdate() {
    console.log('YOOO THIS SOME HOOPLAH: ', this.state);
  }

  updateSearch = (search) => {
    this.setState({ search });
  };

  render() {
    return (
      <View style={styles.viewStyle}>
        {/* DISPLAY SEARCH BAR */}
        <SearchBar
          round
          lightTheme
          searchIcon={{ size: 36 }}
          style={styles.searchBar}
          placeholder=''
          onChangeText={this.updateSearch}
          value={this.state.search}
        />
        <MapView style={styles.mapStyle} region={this.state.position}>
          {/* DISPLAY MARKERS ARRAY */}
          <Marker
            coordinate={{
              latitude: this.state.position.latitude,
              longitude: this.state.position.longitude,
            }}
            pinColor='blue'
          >
            <Callout>
              <Text>Name: Restaurant</Text>
              <Text>Description: dsafljfdslakfs</Text>
            </Callout>
          </Marker>
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  searchBar: {
    marginTop: Platform.OS == 'ios' ? 10 : 0,
  },
});
