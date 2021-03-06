import React, { Component } from 'react';
import FavoriteIcon from './Favorite';
import '../App.css';
import { Button } from 'reactstrap';
import './NashData.css';


var API_KEY = 'AIzaSyCB2yFmL6AughPtoX4pP_4UMK6zGvApHiY';


class NashData extends Component {

    constructor(props) {
        super(props);
       this.state = {
         // data: this.props.data,
         // DataIsLoaded: this.props.loaded,
         googleData: null,
         googleOpen: "N/A",
         click: null,
         imgLink: "https://vignette.wikia.nocookie.net/dumbway2sdie/images/5/5b/Kidneys2.gif/revision/latest?cb=20171219071357",
         googlePhone:"N/A",
         googleLoaded:false,
         searchNameState: false,
         geoLocated:this.props.geolocated
       };
       this.deg2rad = this.deg2rad.bind(this);
    }

    // componentDidMount(){
    //     var component = this
    //
    //     fetch("https://data.nashville.gov/resource/terb-nbm6.json")
    //     .then((resp) => resp.json())
    //     .then(function(data) {
    //         component.setState({
    //             data: data,
    //             DataIsLoaded: true
    //         })
    //     }
    //     )
    // }

    componentDidMount(){
        //creates an empty array if local storage doesn't exist
        const parseLibrary = JSON.parse(localStorage.getItem('favorites'));
        if (!parseLibrary) {
            let faveItem = [];
            localStorage.setItem('favorites', JSON.stringify(faveItem));
        }

    }


    componentWillReceiveProps(){
        if(this.props.search !== "N/A"){
            this.setState({
                searchNameState: true
            })
        }

    }


    getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2-lon1); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
      }

      deg2rad(deg) {
        return deg * (Math.PI/180)
      }

    // Ideally, I will be able to run this function when list item is clicked, and it will drop down with more details of the company.
    grabGoogleData(latitude,longitude,name,street_address,city,zip_code){
        var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        let newName = name.replace(/\s/g, '');
        var component = this
        fetch(proxyUrl + `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyCB2yFmL6AughPtoX4pP_4UMK6zGvApHiY&location=${latitude},${longitude}&radius=2000&keyword=${newName}`)
        .then((resp) => resp.json())
        .then(function(data) {
            //IF statement that checks on whether or on Google Search data exists...
            if (data.results.length > 0) {
                //IF statements that assign "OPEN" or "CLOSE" to googleOpen state if it exists and based on true or false statement
                if (data.results[0].opening_hours) {
                    if (data.results[0].opening_hours.open_now) {
                        component.setState({
                            googleOpen: "OPEN"
                        })
                    } else if (!data.results[0].opening_hours.open_now) {
                        component.setState({
                            googleOpen: "CLOSED"
                        })
                    }
                //...ELSE statement that returns state to default if open now data doesn't exists
                } else {
                    component.setState({
                        googleOpen: "N/A"
                    })
                }
                //IF statement that assign img link if it exists...
                if (data.results[0].photos){
                    component.setState({
                        imgLink: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=250&photoreference=${data.results[0].photos[0].photo_reference}&key=${API_KEY}`
                    })
                //...ELSE statement that returns state to default if img doesn't exists
                } else {
                    component.setState({
                        imgLink:"https://vignette.wikia.nocookie.net/dumbway2sdie/images/5/5b/Kidneys2.gif/revision/latest?cb=20171219071357"
                    })
                }
                fetch(proxyUrl + `https://maps.googleapis.com/maps/api/place/details/json?placeid=${data.results[0].place_id}&key=${API_KEY}`)
                .then((resp) => resp.json())
                .then(function(data) {

                    component.setState({
                        googlePhone: data.result.formatted_phone_number,
                        googleLoaded: true})
                })
            //...ELSE statement that returns state to default if Google Search data doesn't exist
            }
            else {
                component.setState({
                    googleOpen: "N/A",
                    googlePhone: "N/A",
                    imgLink:"https://vignette.wikia.nocookie.net/dumbway2sdie/images/5/5b/Kidneys2.gif/revision/latest?cb=20171219071357"
                })
            }
            //Set the general data to googleData state
            component.setState({
                googleData: data.results[0],
                click: name

            })
        }
        )
    }

    fave(index, phone){
        let parseLibrary = JSON.parse(localStorage.getItem('favorites'));
        let newfaveLocal;
        if (phone === true) {
            newfaveLocal = {
                //targeting name, address, etc..
                name: document.getElementById(`${`Name` + index}`).textContent,
                openq: document.getElementById(`${`OpenQ` + index}`).textContent,
                phone: document.getElementById(`${`Phone` + index}`).textContent,
                address: document.getElementById(`${`Address` + index}`).textContent,
                cityName: document.getElementById(`${`CityName` + index}`).textContent,
                zipCode: document.getElementById(`${`ZipCode` + index}`).textContent,
                image: document.getElementById(`${`Image` + index}`).src
            }
        } else {
            newfaveLocal = {
                //targeting name, address, etc..
                name: document.getElementById(`${`Name` + index}`).textContent,
                openq: document.getElementById(`${`OpenQ` + index}`).textContent,
                address: document.getElementById(`${`Address` + index}`).textContent,
                cityName: document.getElementById(`${`CityName` + index}`).textContent,
                zipCode: document.getElementById(`${`ZipCode` + index}`).textContent,
                image: document.getElementById(`${`Image` + index}`).src 
            }
        }
        parseLibrary.push(newfaveLocal);
        localStorage.setItem('favorites', JSON.stringify(parseLibrary));
    }



    render() {
        let milesTo = ""
        if(this.props.loaded === true && this.state.searchNameState === false){
        const wifiAddresses = this.props.data.map((item, index) => {
            //IF statement that checks on whether or not the one clicked is the one mapped

            if (this.props.geolocated === true){
                milesTo = this.getDistanceFromLatLonInKm(this.props.currentLat,this.props.currentLon,item.mapped_location.coordinates[1],item.mapped_location.coordinates[0]);
                milesTo = milesTo * .6;
                milesTo = Math.round(milesTo * 100) / 100;
                milesTo = `${milesTo}mi`;

            }
            else {
                console.log("no geolocation");
            }


            if(this.state.click === item.site_name && this.state.googleLoaded === true){

                return (
                    <li key={index}><b id={"Name" + index}>{item.site_name}</b><FavoriteIcon fave={this.fave} index={index} phone={true}/><br /><Button color="success" onClick={this.grabGoogleData.bind(this,item.mapped_location.coordinates[1],item.mapped_location.coordinates[0],item.site_name)}>More...</Button>
                    <br/><span id={"OpenQ" + index}>{this.state.googleOpen}</span><br />Phone: <span id={"Phone" + index}>{this.state.googlePhone}</span><br />
                    <span id={"Address" + index}>{item.street_address}</span><br /><span id={"CityName" + index}>{item.city}</span>, <span id={"ZipCode" + index}>{item.zip_code}</span><br />
                    <h3 className="miles">{milesTo}</h3>
                    <center><img id={"Image" + index} src={this.state.imgLink} alt="Location"/></center>
                    </li>
                )

            }
            if (this.state.click === item.site_name) {
                return (
                    <li key={index}><b id={"Name" + index}>{item.site_name}</b><FavoriteIcon fave={this.fave} index={index} phone={false}/><br /><Button color="success" onClick={this.grabGoogleData.bind(this,item.mapped_location.coordinates[1],item.mapped_location.coordinates[0],item.site_name)}>More...</Button>
                    <br/><span id={"OpenQ" + index}>{this.state.googleOpen}</span><br/>
                    <span id={"Address" + index}>{item.street_address}</span><br /><span id={"CityName" + index}>{item.city}</span>, <span id={"ZipCode" + index}>{item.zip_code}</span><br />
                    <h3 className="miles">{milesTo}</h3>
                    <center><img id={"Image" + index} src={this.state.imgLink} alt="Location"/></center>
                    </li>
                )
            }
            else {
                return (
                    <li key={index}><b>{item.site_name}</b><br /><Button color="success" onClick={this.grabGoogleData.bind(this,item.mapped_location.coordinates[1],item.mapped_location.coordinates[0],item.site_name)}>More...</Button><h3 className="miles">{milesTo}</h3></li>                    
                )
            }
        }
    )

               return(

            <div className="listDiv margin-top d-flex justify-content-left">
            <ul>
            {wifiAddresses}
            </ul>

            </div>

        )

    } else if (this.state.searchNameState) {
        const wifiAddresses = this.props.data.map((item, index) => {
            if (this.props.geolocated === true){
                milesTo = this.getDistanceFromLatLonInKm(this.props.currentLat,this.props.currentLon,item.mapped_location.coordinates[1],item.mapped_location.coordinates[0]);
                milesTo = milesTo * .6;
                milesTo = Math.round(milesTo * 100) / 100;
                milesTo = `${milesTo}mi`;

            }
            else {
                console.log("no geolocation");
            }
            let lowerData = item.site_name.toLowerCase();
            let lowerSearch = this.props.search.toLowerCase();
            if (lowerData.includes(lowerSearch)) {
                if(this.state.click === item.site_name && this.state.googleLoaded === true){
                    if (this.props.geolocated === true){
                        milesTo = this.getDistanceFromLatLonInKm(this.props.currentLat,this.props.currentLon,item.mapped_location.coordinates[1],item.mapped_location.coordinates[0]);
                        milesTo = milesTo * .6;
                        milesTo = Math.round(milesTo * 100) / 100;
                        milesTo = `${milesTo}mi`;
    
                    }
                    else {
                        console.log("no geolocation");
                    }
                    return (
                        <li key={index}><b id={"Name" + index}>{item.site_name}</b><FavoriteIcon fave={this.fave} index={index} phone={true}/><br /><Button color="success" onClick={this.grabGoogleData.bind(this,item.mapped_location.coordinates[1],item.mapped_location.coordinates[0],item.site_name)}>More...</Button>
                        <br/><span id={"OpenQ" + index}>{this.state.googleOpen}</span><br />Phone: <span id={"Phone" + index}>{this.state.googlePhone}</span><br />
                        <span id={"Address" + index}>{item.street_address}</span><br /><span id={"CityName" + index}>{item.city}</span>, <span id={"ZipCode" + index}>{item.zip_code}</span><br />
                        <h3 className="miles">{milesTo}</h3><br />
                        <center><img id={"Image" + index} src={this.state.imgLink} alt="Location"/></center>
                        </li>
    
                    )
    
                }
                if (this.state.click === item.site_name) {
                    return (
                        <li key={index}><b id={"Name" + index}>{item.site_name}</b><FavoriteIcon fave={this.fave} index={index} phone={false}/><br /><Button color="success" onClick={this.grabGoogleData.bind(this,item.mapped_location.coordinates[1],item.mapped_location.coordinates[0],item.site_name)}>More...</Button>
                        <br/><span id={"OpenQ" + index}>{this.state.googleOpen}</span><br/>
                        <span id={"Address" + index}>{item.street_address}</span><br /><span id={"CityName" + index}>{item.city}</span>, <span id={"ZipCode" + index}>{item.zip_code}</span><br />
                        <h3 className="miles">{milesTo}</h3>
                        <center><img id={"Image" + index} src={this.state.imgLink} alt="Location"/></center>
                        </li>
                    )
                }
                else {
                    return (
                        <li key={index}><b>{item.site_name}</b><br /><Button color="success" onClick={this.grabGoogleData.bind(this,item.mapped_location.coordinates[1],item.mapped_location.coordinates[0],item.site_name)}>More...</Button><h3 className="miles">{milesTo}</h3></li>                    
                    )
                }
            }
        })
        return (
            <div className="margin-top">
            <ul>
            {wifiAddresses}
            </ul>
            </div>
        )
    
    }else{

        return(
        <div>
        Loading...
        </div>
        )
    }
    }

}




export default NashData;
