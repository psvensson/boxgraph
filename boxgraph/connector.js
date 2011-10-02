dojo.provide("boxgraph.connector");


dojo.require("boxgraph.routing.manhattan");
dojo.require("boxgraph.routing.manhattan2");
dojo.require("boxgraph.routing.straight");
dojo.require("boxgraph.routing.curved");

dojo.require("dojox.gfx");

/*
 The connector exists on two modes; 1 = Live, 2 = Decorative. The live mode means that a port has created it in responsoe to a user click and its line will be drawn conitnually in responsoe to
 mouse movemenets - until the user clicks again within the ratio of another, accepting, port o another block. In decorative mode, it just renders the line between the two ports of the two blocks
 */
dojo.declare("boxgraph.connector", null, {
		surface					: "",
		//routing               : "straight", // "straight", "manhattan", "curved"
		routing					: "manhattan", // "straight", "manhattan", "curved"
		boxmanager				: "",
        numbering               : false,

		constructor: function(args)
		{
			this.inherited(arguments);
			console.log("boxgraph.connector constructor called. args are...");
			console.dir(args);
			if (!args.firstport || !args.secondport)
			{
				//throw "Y U NO BOTH FIRST AND SECOND PORTS!!!?";
				return;
			}
			this.firstport = args.firstport;
			this.secondport = args.secondport;
			this.surface = args.surface;
			this.boxmanager = args.boxmanager;
			this.routing = args.routing || this.routing;

			//this.manhattan = new boxgraph.routing.manhattan({boxmanager: this.boxmanager});
			this.manhattan 	= new boxgraph.routing.manhattan2({boxmanager: this.boxmanager});
			this.straight	 	= new boxgraph.routing.straight({boxmanager: this.boxmanager});
			this.curved 		= new boxgraph.routing.curved({boxmanager: this.boxmanager});
			console.log("drawing line..");
			this.drawLine();

			dojo.subscribe("boxgraph_redraw", dojo.hitch(this, function()
			{
				this.flush();
			}));
		},

		flush: function()
		{
			if (this.line)
			{
				console.log("connector flush redrawing line yohoo");
				this.surface.remove(this.line);
				this.surface.remove(this.shadowline);
				this.drawLine();
			}
		},

		drawLine: function()
		{
			console.log("+++ boxgraph.connector.drawLine called. this.firstport = "+this.firstport+", this.secondport = "+this.secondport);

			var ll = this.getRoute();
			
			//this.line = ll.x1 ? this.surface.createLine(ll) : this.surface.createPolyline(ll);
			// Debug failsafe
			dojo.forEach(ll, function(l)
			{
				delete l.collidedwith;
                delete l.dir;
			});
            
            console.log("got route of type '" + this.routing + "' ;");
    		console.dir(ll);

			this.line = this.getType().drawLine(ll, this.surface, this.firstport, this.secondport);
			console.log("connector line drawn");
			// create a larger highlight to show on mouseover

			try
			{
				this.shadowline = this.getType().drawShadowLine(ll, this.surface, this.firstport, this.secondport);
				console.log("connector shadow line drawn");
				this.shadowline.setStroke({color: [0, 0, 0, 0], width: 10 });
				var snode = this.shadowline.getNode();
				console.log("shadowline node is "+snode);
				dojo.connect(snode, "onmouseover", this, this.onMouseOverShadowLine);
				dojo.connect(this.line.getNode(), "onmouseover", this, this.onMouseOverShadowLine);
				dojo.connect(snode, "onmouseout", this, this.onMouseOutShadowLine);
			}
			catch(e)
			{
				console.log("ERRORRRRR!! " + e);
			}

			console.log("polyline created");
			this.line.setStroke({color: "#36A9CF", width: 1});
			console.log("----------------------------------------------------- route drawn ------------------------------------------------------------------");
		},

		onMouseOutShadowLine: function(e)
		{
			console.log("onMouseOutShadowLine");
			this.shadowline.setStroke({color: [0, 0, 0, 0], width: 10});
			if (this.shadowconnect)
			{
				dojo.disconnect(this.shadowconnect);
			}
		},

		onMouseOverShadowLine: function(e)
		{
			console.log("onMouseOverShadowLine");
			this.shadowline.setStroke({color: [0, 0, 255, 0.2], width: 10 });
			this.shadowconnect = dojo.connect(this.shadowline.getNode(), "onclick", this, this.onShadowLineClick);
		},

		onShadowLineClick: function(e)
		{
			if(this.line)
			{
				console.log("sending disconnect event..");
				this.surface.remove(this.line);
				this.surface.remove(this.shadowline);
				dojo.publish("boxgraph_disconnect", [this.firstport, this.secondport]);
			}
		},

		getRoute: function()
		{
			return this.getType().getRouting(this.firstport, this.secondport);
		},

		getType: function()
		{
			var rv = "foo";
			switch (this.routing)
			{
			case "straight":
				rv = this.straight;
				break;
			case "manhattan":
				rv = this.manhattan;
				break;
			case "curved":
				rv = this.curved;
				break;
			}
			return rv;
		}



	});
