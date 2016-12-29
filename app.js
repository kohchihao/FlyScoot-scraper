"use strict"
const osmosis = require("osmosis")
const chalk = require('chalk')
const chalkRainbow = require('chalk-rainbow')

var prevLowestOutboundFare=0
var prevLowestReturnFare=0

// Time constants
const TIME_MS = 1
const TIME_SEC = TIME_MS * 1000
const TIME_MIN = TIME_SEC * 60
const TIME_HOUR = TIME_MIN * 60

const fares = {
	outbound: [],
	return: []
}

var interval = 30 // In minutes

const fetch = () => {
   osmosis
     .get("http://makeabooking.flyscoot.com/Book")
     .submit(".form-booking__multi", {
     	"revAvailabilitySearch.SearchInfo.Direction" : "Multicity",
     	"revAvailabilitySearch.SearchInfo.SearchStations[0].DepartureStationCode" : "SIN",
     	"revAvailabilitySearch.SearchInfo.SearchStations[0].ArrivalStationCode" : "DMK",
     	"revAvailabilitySearch.SearchInfo.SearchStations[0].DepartureDate" : "01/01/2017",
     	"revAvailabilitySearch.SearchInfo.SearchStations[1].DepartureStationCode" : "DMK",
     	"revAvailabilitySearch.SearchInfo.SearchStations[1].ArrivalStationCode" : "SIN",
		"revAvailabilitySearch.SearchInfo.SearchStations[1].DepartureDate" : "01/06/2017",
		"revAvailabilitySearch.SearchInfo.AdultCount" : "2",
		"revAvailabilitySearch.SearchInfo.ChildrenCount" : "0"

     })
     .find('#departure-results .fare-wrapper .price.price--sale')
     .then((priceMarkup)=>{
 	      var matches = priceMarkup.toString().match(/SGD.*?(\d+)/)
 	      var price = matches[1];
 	     
 	      fares.outbound.push(price)
     })
     .find('#return-results .fare-wrapper .price.price--sale')
     .then((priceMarkup)=>{
     	var matches = priceMarkup.toString().match(/SGD.*?(\d+)/)
 	    var price = matches[1];
 	    //console.log(price)
 	    fares.return.push(price)
     })
     .done(()=>{
     	const lowestOutboundFare = Math.min(...fares.outbound)
 	    const lowestReturnFare = Math.min(...fares.return)

 	    const outboundFareDiff = prevLowestOutboundFare - lowestOutboundFare
 	    const returnFareDiff = prevLowestReturnFare - lowestReturnFare
 	    
 	    if(lowestOutboundFare <= 50 && lowestReturnFare <= 50){
 	    	
 	    	console.log(chalkRainbow("DEAL ALERT!!!! " + lowestOutboundFare +","+lowestReturnFare))

 	    }

 	    console.log(chalk.blue("Lowest fair for outbound flight is currently $"+lowestOutboundFare + " Difference of $" + outboundFareDiff +"\n" +
 	    	"Lowest fair for inbound flight is currently $" + lowestReturnFare + " Difference of $" + returnFareDiff))


 	    // Store current fares
        prevLowestOutboundFare = lowestOutboundFare
        prevLowestReturnFare = lowestReturnFare

 	    setTimeout(fetch, interval * TIME_MIN)
     })
     
    
 }

fetch()
     