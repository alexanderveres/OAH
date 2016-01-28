/*
* Open Message Hub project.
* Allows communication between IFRAMEs in same domain.
*
* version 0.1 beta
*
* author: Alexander Veres
*/
var OMH = {
	ALL_EVENTS : '*',
	parent : null,
	children : new Array(),
	events : {},
	subscribe : function(event, handler){
		if(!OMH.events[event]) {
			OMH.events[event] = new Array();
		};
		OMH.events[event].push(handler);
	},
	publish : function(event, message) {
		OMH.propagate(event, message, false);
	},
	triggerHandlers : function(event, message){
		if(OMH.events[event]) {
			for(var i = 0; i < OMH.events[event].length; i++) {
				var handler = OMH.events[event][i];
				handler(event,message);
			}
		};
		if(OMH.events[OMH.ALL_EVENTS]) {
			for(var i = 0; i < OMH.events[OMH.ALL_EVENTS].length; i++) {
				var handler = OMH.events[OMH.ALL_EVENTS][i];
				handler(event,message);
			}
		};
	},
	propagate : function(event, message, fromTop) {
		if(fromTop) {
			OMH.triggerHandlers(event, message);
			for(var i=0; i < OMH.children.length; i++) {
				OMH.children[i].propagate(event, message, true);
			}
		} else {
			if(OMH.parent){
				OMH.parent.propagate(event,message,false);
			} else {
				OMH.propagate(event, message, true);
			}
		}
	}
};


function _omh(){
	var initialize = function(){
		var win = window;
		while(!OMH.parent && win != win.parent) {
			if(win.parent.OMH) {
				OMH.parent = win.parent.OMH;
				OMH.parent.children.push(OMH);
			}
			win = win.parent;
		}
	};
	initialize();
};
_omh();