Ext.setup({
    icon: 'icon.png',
    glossOnIcon: true,
    onReady : function() {
	     var socializerId = 25;	
		 Ext.regModel('Contact', {
		    fields: ['name', 'place', 'description', 'logo', 'count', 'id', 'type' ]
		 });
	
		var latitude = 23.738369;
		var longitude = -99.142342;
		var accuracy = 0.0;
		var getLocation = function (position){
	    	latitude = position.coords.latitude; 
	        longitude = position.coords.longitude;
	        accuracy = position.coords.accuracy;
	        
			localStorage.setItem("lat", latitude);
			localStorage.setItem("lon", longitude);
			navigator.geolocation.clearWatch(idWatcher);
			
			alert(longitude+', '+latitude+'. '+accuracy)
		}
	
		if (navigator.geolocation) {
				idWatcher = navigator.geolocation.watchPosition(getLocation, null, {enableHighAccuracy:true});
		} else {
	    	alert ('No geolocation service');
		}
		
		
		var placePosition = new google.maps.LatLng(longitude, latitude),
						            infowindow = new google.maps.InfoWindow({
						                content: 'I am here: ' + longitude +', '+ latitude
						            }),
		mapdemo = new Ext.Map({
				mapOptions : {
                center : new google.maps.LatLng(23.738369, -99.142342),  //Victoria's Center
                zoom : 14,
                mapTypeId : google.maps.MapTypeId.ROADMAP,
                navigationControl: true,
                navigationControlOptions: {
                        style: google.maps.NavigationControlStyle.DEFAULT
                    }
            },

            listeners : {
                maprender : function(comp, map){
                    var marker = new google.maps.Marker({
                                     position: placePosition,
                                     title : 'Tecnotam',
                                     map: map
                                });

                                google.maps.event.addListener(marker, 'click', function() {
                                     infowindow.open(map, marker);
                                });
                }

            }
        });
		
		var panel = new Ext.Panel({
		    fullscreen: true,    
		    dockedItems: [
		        {
		            dock : 'top',
		            xtype: 'toolbar',
					defaults:{ui:'plain'},			
		            items:[{
		            xtype: 'button',
		            	text:'<font size=\"3\">PBRManager</font>'
		            },
					{xtype:'spacer'}]
		        },
		        {
					xtype: 'toolbar',
					ui: 'light',
					dock: 'top',
					defaults: {
						iconMask: true,
						ui: 'plain'
					},
					layout: {
						pack: 'left',
					},
					items: [
							{
							text : 'Check In',
		                        ui: 'confirm',                    
		                        handler : function(){
		                            alert ('Server, I am at:' +longitude+', '+ latitude)
		                            
		                            store2 = new Ext.data.Store({
									model  : 'Contact',	
									proxy:{
										type:'rest',
										url:'addPosition.php?longitude='+longitude+'&latitude='+latitude+'&accuracy='+accuracy
											}
									});							
							
									store2.load();
								}
							}
						]
		        }
		        ],
		       items:[mapdemo]
		});
	 
	}
});

