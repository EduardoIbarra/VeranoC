var myStore;
var myModel;
var gmapPanel;
function initialize() {
    var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
    var myOptions = {
      zoom: 4,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    
    var marker = new google.maps.Marker({
        position: myLatlng, 
        map: map,
        title:"Hello World!"
    });   
}
Ext.require('Ext.data.Store');
Ext.onReady(function(){
	Ext.define('User', {
	    extend: 'Ext.data.Model',
	    fields: [
	    	{name: 'longitude', type: 'float'},
	    	{name: 'latitude', type: 'float'},
	        {name: 'ttimestamp', type: 'Date'}
	    ]
	});
	Ext.require('Ext.data.Store');
	myStore = Ext.create('Ext.data.Store', {
		storeId:'geoStore',
	    model: 'User',
	    //autoLoad: true,
	    autoLoad: {
        callback: function(el){
        	//gmapPanel.addMarker(position: myPosition, title:"Hello World!");
        	alert(myStore.getAt(1).raw['longitude']);
        }, 
         scripts: true, 
         nocache: true
      },
	    
	    proxy: {
	    	type:'ajax',
			url:'data.php',
			reader: {
				type: 'json',
				root: 'myInventory'
			}
			
		}
	});


myStore.each(function(record)  
{   
  record.fields.each(function(field) 
  { 
    var fieldValue = record.get(field.name); 
  }); 

// Alternatively... 
/*     
  for (var rd in record.data) 
  { 
    var fName = rd; 
    var fValue = record.data[rd]; 
  } 
*/ 
}, this);  

var yourGrid;
yourGrid = Ext.create('Ext.grid.Panel', {
    title: 'Geolocation',
    store: Ext.data.StoreManager.lookup('geoStore'),
    columns: [
        {header: 'longitude',  dataIndex: 'longitude'},
        {header: 'latitude',  dataIndex: 'latitude'},
        {header: 'Timestamp',  dataIndex: 'ttimestamp'}
    ],
    height: 200,
    width: 400,
    renderTo: Ext.getBody()
});
    	
   
		gmapPanel = new Ext.ux.GoogleMapPanel({
        gmapType: 'map'  // map, panorama
        ,mapOptions: {
        	zoom: 15
        	, scaleControl: true
        	, mapTypeId: google.maps.MapTypeId.ROADMAP // HYBRID, ROADMAP, SATELLITE, TERRAIN
        }
        ,setCenter: {
            lat: 23.70986510193644,
            lng: -99.17991694101639
            ,marker: {title: 'Chinatown Point'}
            ,circleOverlay: true
            ,circleOverlayOptions: {
						    radius: 1000, // in meter
						    strokeColor: "#FF0000",
						    strokeOpacity: 0.8,
						    strokeWeight: 1,
						    fillColor: "#FF0000",
						    fillOpacity: 0.35
					 	}
        }
        ,markers: [{
            lat: 23.710,
            lng: -99.1795,
            marker: {title: 'Sri Mariamman Temple'},
            listeners: {
                click: function(e){
                    Ext.Msg.alert('Temple');
                }
            }
        	},/*
{
            lat: 23.71839,
            lng: -99.178234,
            marker: {title: 'Sri Mariamman Temple'},
            listeners: {
                click: function(e){
                    Ext.Msg.alert('Temple');
                }
            }
        	},
*/{
            lat: 25.7258012,
            lng: -100.297735,
            marker: {title: 'Jamae Mosque'},
            infoWindowOptions: { content: "Jamae Mosque" }
        	}]
		});
/*
		myStore.on('load', function(store, records, options) 
		{ 
		  var fieldValue; 
		
		  records.each(function(record)   
		  { 
		    myStore.fields.each(function(field)  
		    {  
		      fieldValue = record.get(field.name);        
		    });  
		  }, this); 
		}); 
*/
	  //gmapPanel.addMarker({lat: 23.70986510193644, lng:-99.17991694101639});
	  //alert(gmapPanel.getCenter());
	  
	  
	  var mapwin = new Ext.Window({
	      layout: 'fit',
	      title: 'GMap Window',
	      closeAction: 'hide',
	      width:600,
	      height:600,
	      x: 40,
	      y: 60,
	      items: gmapPanel,
	      onLoadSuccess: function () {
          	alert('');
     		},
	  });

    mapwin.show();	

});