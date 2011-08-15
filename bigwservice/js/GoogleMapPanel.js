/**
 * @class Ext.ux.GoogleMapPanel
 * @extends Ext.Panel
 * Tested on Ext JS Library 3.3.1
 * version 1.0
 */
Ext.ux.GoogleMapPanel = Ext.extend(Ext.Panel, {
    initComponent : function(){
        
        if(!(window.google || {}).maps){
						Ext.Msg.alert('Google Maps API is required');
        }

        var defPOVConfig = {
            heading: 34,
            pitch: 10,
            zoom: 1,
        };
                
        Ext.applyIf(this,defPOVConfig);
        
        Ext.ux.GoogleMapPanel.superclass.initComponent.call(this);        
    },
    afterRender : function(){        
        var wh = this.ownerCt.getSize();
        Ext.applyIf(this, wh);
        
        Ext.ux.GoogleMapPanel.superclass.afterRender.call(this);    
        this.renderMap();
    },
    renderMap : function(){
        this.mapOptions = this.mapOptions || {};
        Ext.applyIf(this.mapOptions, {
        	center: new google.maps.LatLng(1.2853132210987,103.84484934617)
        	,zoom: 14
        	,scaleControl: true
        	,mapTypeId: google.maps.MapTypeId.ROADMAP // HYBRID, ROADMAP, SATELLITE, TERRAIN
        });
        this.gmap = new google.maps.Map(this.body.dom, this.mapOptions);
        
        if (typeof this.setCenter === 'object') {
            if (typeof this.setCenter.geoCodeAddr === 'string'){
                this.geoCodeLookup(this.setCenter.geoCodeAddr);
                // geoCodeLookkup is async thus the onMapReady is called after successful respond.
            }else{
                var point = new google.maps.LatLng(this.setCenter.lat,this.setCenter.lng);
                this.gmap.setCenter(point);    
				        if (typeof this.setCenter.marker === 'object' && typeof point === 'object'){
										var iwo = (this.setCenter.infoWindowOptions) ? this.setCenter.infoWindowOptions : null;
				            this.centerMarker = this.addMarker(this.getCenter(),this.setCenter.marker,this.setCenter.marker.clear, true, this.setCenter.listeners, iwo);
				        }
                this.onMapReady();
            }
        }

        this.fireEvent('maprender', this, this.gmap);        
    },
    onMapReady : function(){
        if (this.gmapType === 'panorama'){
        		var o = { position: this.getCenter(), pov: { heading: this.heading, pitch: this.pitch, zoom: this.zoom}};
        		this.panoramaOptions = (this.panoramaOptions == null) ? o : this.panoramaOptions;
        		this.panorama = new google.maps.StreetViewPanorama(this.body.dom, this.panoramaOptions);
        		this.gmap.setStreetView(this.panorama);
        }
        this.addMarkers(this.markers);
        
        if (this.setCenter.circleOverlay) {
        	this.setCenter.circleOverlayOptions = this.setCenter.circleOverlayOptions || {};
	        Ext.applyIf(this.setCenter.circleOverlayOptions, {
				    radius: 1000, // in meter
				    strokeColor: "#FF0000",
				    strokeOpacity: 0.8,
				    strokeWeight: 2,
				    fillColor: "#FF0000",
				    fillOpacity: 0.35
	        });
        	this.drawCircle(this.setCenter.circleOverlayOptions);
        }
    },
    onResize : function(w, h){
        Ext.ux.GoogleMapPanel.superclass.onResize.call(this, w, h);
    },
    setSize : function(width, height, animate){
        Ext.ux.GoogleMapPanel.superclass.setSize.call(this, width, height, animate);
    },
    getMap : function(){        
        return this.gmap;       
    },
    getCenter : function(){    
        return this.getMap().getCenter();  
    },
    getCenterLatLng : function(){
        var ll = this.getCenter();
        return {lat: ll.lat(), lng: ll.lng()};
    },
    getState : function(){
        return this.mapOptions;  
    },
    addMarkers : function(markers) {
        if (Ext.isArray(markers)){
            for (var i = 0; i < markers.length; i++) {
                var mkr_point = new google.maps.LatLng(markers[i].lat,markers[i].lng);
                var iwo = (markers[i].infoWindowOptions) ? markers[i].infoWindowOptions : null;
                this.addMarker(mkr_point,markers[i].marker,false,markers[i].setCenter, markers[i].listeners, iwo);
            }
        }        
    },
    addMarker : function(point, marker, clear, center, listeners, infoWindowOptions){        
        if (clear === true){
            this.getMap().clearOverlays();
        }
        if (center === true) {
            this.getMap().setCenter(point);
        }

		    var mark = new google.maps.Marker({
		        map: this.getMap(),
		        position: point,
		        title: marker.title
		    });
		    
		    var infoWindow = null;
		    if (infoWindowOptions != null) {
		    	infoWindow = new google.maps.InfoWindow(infoWindowOptions);
		    	
	    		google.maps.event.addListener(mark, 'click', function() {
  					infoWindow.open(this.getMap(),mark);
					});
		    }

        if (typeof listeners === 'object'){
            for (evt in listeners) {
                google.maps.event.addListener(mark, evt, listeners[evt]);
            }
        }
        
        return mark;
    },
    // @private
    geoCodeLookup : function(addr) {        
        this.geocoder = new google.maps.Geocoder();
        this.geocoder.geocode({ 'address': addr }, this.addAddressToMap.createDelegate(this));        
    },
    // @private
    addAddressToMap : function(results, status) {        
        if (status !== google.maps.GeocoderStatus.OK) {
            Ext.MessageBox.alert('Error', 'Code '+response.Status.code+' Error Returned');
        }else{
            place = results[0];
            addressinfo = place.formatted_address;
            point = place.geometry.location;
            if (typeof this.setCenter.marker === 'object' && typeof point === 'object'){
                this.addMarker(point,this.setCenter.marker,this.setCenter.marker.clear,true, this.setCenter.listeners);
            }
            this.getMap().setCenter(point);
            this.onMapReady();
        }        
    },    
    drawCircle: function(circleOptions) {
				this.circleOverlays = new google.maps.Circle(circleOptions);
        this.circleOverlays.setCenter(this.getCenter());
        this.circleOverlays.setMap(this.getMap());

				//this.circleOverlays.bindTo('center', this.centerMarker, 'position');
	  },
	  onDestroy : function() {
        if (this.map && (window.google || {}).maps) {
            google.maps.event.clearInstanceListeners(this.map);
        }
        Ext.ux.GoogleMapPanel.superclass.onDestroy.call(this);
    },
    onUpdate : function(map, e, options) {
        this.update((options || {}).data);
    }, 
    // currently it only pan to the new coordinate
    // for future extension
    update : function(coordinates) {
        coordinates = coordinates || new google.maps.LatLng(1.2853132210987,103.84484934617);
        
        if (coordinates && !(coordinates instanceof google.maps.LatLng) && 'lng' in coordinates) {
            coordinates = new google.maps.LatLng(coordinates.lat, coordinates.lng);
        }
        
        if (!this.hidden && this.rendered) {
            this.gmap || this.renderMap();
            if (this.gmap && coordinates instanceof google.maps.LatLng) {
            	this.getMap().setCenter(coordinates);
              this.gmap.panTo(coordinates);
            }
        }
        else {
            this.on('activate', this.onUpdate, this, {single: true, data: coordinates});
        }
    },    
    // @private
    onResize : function( w, h) {
        Ext.ux.GoogleMapPanel.superclass.onResize.apply(this, arguments);
        if (this.gmap) {
            google.maps.event.trigger(this.gmap, 'resize');
        }
    }    
    // for future extension
		, useCurrentLocation: false
		, gmap: null	
});
