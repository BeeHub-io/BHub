import React from 'react';
import MapView, { Callout, Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Button } from 'react-native';
import { SearchBar } from 'react-native-elements';
import * as Google from 'expo-google-app-auth';

const IOS_CLIENT_ID =
  '620395064803-ne7653344g2f152ed4kql428u3puc7fg.apps.googleusercontent.com';

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
      radius: 5000,
      search: '',
      results: [],
      loggedIn: false,
    };
  }

  signInWithGoogle = async () => {
    try {
      const result = await Google.logInAsync({
        iosClientId: IOS_CLIENT_ID,
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        console.log('LoginScreen.js.js 21 | ', result.user.givenName);
        this.props.navigation.navigate('Profile', {
          username: result.user.givenName,
        }); //after Google login redirect to Profile
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      console.log('LoginScreen.js.js 30 | Error with login', e);
      return { error: true };
    }
  };

  getYelp = () => {
    let latitude = this.state.position.latitude;
    let longitude = this.state.position.longitude;
    let radius = this.state.radius;
    const queryAllString = `?latitude=${latitude}&longitude=${longitude}&radius=${radius}`;
    fetch(
      `https://api.yelp.com/v3/businesses/search${queryAllString}` + `&price=1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer BHgF17sVB1nq84WpSrlu-w8fiCq3VIwXsImhNA1AZjcPt7UFCPuebY8nhglwQV5PYdnLCkUbM8Gw23SYrL0scYR_T9K6w_unJVqZ5H2wRgt29ORpu9X8F-5WKaKYX3Yx',
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // filter out out chains and franchises, with more than 50 reviews ??
        // OR if we want to specify restaurants we need to do it manually
        // e.g array of restaurants to filter out
        // const notFranchises = data.filter((el) => el.review_count < 50);
        // console.log('data: ', data);
        this.setState({ results: data.businesses });
        console.log(this.state.results);
      })
      .catch((err) =>
        console.log(
          'ERROR IN COMPONENT DID MOUNT > FETCH > YELP API ERROR: ',
          err
        )
      );
  };

  getSearch = () => {
    let latitude = this.state.position.latitude;
    let longitude = this.state.position.longitude;
    let radius = this.state.radius;
    let newSearch = this.state.search;
    const queryAllString = `?term=${newSearch}&latitude=${latitude}&longitude=${longitude}&radius=${radius}`;
    fetch(
      `https://api.yelp.com/v3/businesses/search${queryAllString}` + `&price=1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer BHgF17sVB1nq84WpSrlu-w8fiCq3VIwXsImhNA1AZjcPt7UFCPuebY8nhglwQV5PYdnLCkUbM8Gw23SYrL0scYR_T9K6w_unJVqZ5H2wRgt29ORpu9X8F-5WKaKYX3Yx',
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // filter out out chains and franchises, with more than 50 reviews ??
        // OR if we want to specify restaurants we need to do it manually
        // e.g array of restaurants to filter out
        // const notFranchises = data.filter((el) => el.review_count < 50);
        // console.log('data: ', data);
        this.setState({ results: data.businesses });
        console.log(this.state.results);
      })
      .catch((err) =>
        console.log(
          'ERROR IN COMPONENT DID MOUNT > FETCH > YELP API ERROR: ',
          err
        )
      );
  };
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
      this.getYelp();
    });
  }

  componentDidUpdate() {
    console.log('YOOO THIS SOME HOOPLAH: ', this.state);
    // this.getYelp();
  }

  updateSearch = (search) => {
    this.setState({ search });
  };

  render() {
    const resultsArr = this.state.results.map((el) => {
      return (
        <Marker
          coordinate={{
            latitude: el.coordinates.latitude,
            longitude: el.coordinates.longitude,
          }}
          pinColor='red'
          key={el.id}
        >
          <Callout>
            <Text>Name: {el.name}</Text>
            <Text>Address: {el.location.display_address}</Text>
          </Callout>
        </Marker>
      );
    });

    return (
      <View style={styles.viewStyle}>
        <View>
          <View style={styles.searchView}>
            <Button title='Login with Google' onPress={this.signInWithGoogle} />
            <SearchBar
              containerStyle={{
                backgroundColor: 'none',
                border: 'none',
                color: 'none',
              }}
              round
              lightTheme
              searchIcon={{ size: 36 }}
              style={styles.searchBar}
              placeholder='Search'
              onChangeText={this.updateSearch}
              value={this.state.search}
              onSubmitEditing={this.getSearch}
            />
          </View>
          <MapView style={styles.mapStyle} region={this.state.position}>
            {resultsArr}
            <Marker
              coordinate={{
                latitude: this.state.position.latitude,
                longitude: this.state.position.longitude,
              }}
              pinColor='blue'
            >
              <Callout>
                <Text>Current Location</Text>
              </Callout>
            </Marker>
          </MapView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {},
  searchView: {
    position: 'relative',
    top: 40,
    zIndex: 1,
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: 0,
    position: 'absolute',
  },
  searchBar: {
    borderTopLeftRadius: 100,
  },
});
