define(
    [
        "dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/text!./editor.html",
        "dojo/dom-style",
        "dojo/_base/fx",
        "dojo/_base/lang",
        "dojox/gfx",
        "boxgraph/port",
        "boxgraph/portmanager",
        "boxgraph/boxmanager",
        "boxgraph/base",
        "dojo/on",
        "dojox/gfx/move",
        "boxgraph/routing/manhattan",
        "boxgraph/routing/manhattan2",
        "boxgraph/routing/straight",
        "boxgraph/routing/curved",
        "dojo/_base/array",
        "dojo/_base/connect"
    ],
    function(declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin
        , template, domStyle, baseFx, lang, gfx, port, portmanager,
             boxmanager, base, on, move, manhattan, manhattan2,
             straight, curved, array, connect)
    {
        return declare([],
            {


		surface					: "",
		//routing               : "straight",
		// "straight", "manhattan", "curved"
		routing					: "manhattan",
		// "straight", "manhattan", "curved"
		boxmanager				: "",
        numbering               : false,

		constructor: function(args)
		{
			this.inherited(arguments);

			//console.dir(args);
			if (!args.firstport || !args.secondport)
			{
				//throw "Y U NO BOTH FIRST AND SECOND PORTS!!!?";
				return;
			}
			this.firstport = args.firstport;
			this.secondport = args.secondport;
            this.firstbox = args.firstbox;
            this.surface = args.surface;
			this.boxmanager = args.boxmanager;
			this.routing = args.routing || this.routing;

			//this.manhattan = new boxgraph.routing.manhattan(
			// {boxmanager: this.boxmanager});
			this.manhattan 	    = new manhattan2({boxmanager:
                this.boxmanager});
			this.straight	 	= new straight({boxmanager:
                this.boxmanager});
			this.curved 		= new curved({boxmanager:
                this.boxmanager});
			//console.log("drawing line..");
			this.drawLine();

			dojo.subscribe("boxgraph_redraw", dojo.hitch(this, function()
			{
				this.flush();
			}));

            dojo.subscribe("startconnect", dojo.hitch(this, function()
            {
                console.log("connector got startconnect, so not listening.")
                this.deaf = true;
            }));

            dojo.subscribe("stopconnect", dojo.hitch(this, function()
            {
                this.deaf = false;
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
			//console.log("+++ boxgraph.connector.drawLine called.
			// this.firstport = "+this.firstport+
			// ", this.secondport = "+this.secondport);
			var ll = this.getRoute();
			//this.line = ll.x1 ? this.surface.createLine(ll) :
			// this.surface.createPolyline(ll);
			// Debug failsafe
			array.forEach(ll, function(l)
			{
				delete l.collidedwith;
                delete l.dir;
			});
            
            //console.log("got route of type '" + this.routing + "' ;");
    		//console.dir(ll);

			this.line = this.getType().drawLine(ll, this.surface,
                this.firstport, this.secondport);
			//console.log("connector line drawn");
			// create a larger highlight to show on mouseover

			try
			{
				this.shadowline = this.getType().drawShadowLine(ll,
                    this.surface, this.firstport, this.secondport);
				//console.log("connector shadow line drawn");
				this.shadowline.setStroke({color: [0, 0, 0, 0], width: 10 });
				var snode = this.shadowline.getNode();
				//console.log("shadowline node is "+snode);
				connect.connect(snode, "onmouseover", this,
                    this.onMouseOverShadowLine);
                connect.connect(this.shadowline.getNode(),
                    "onmouseover", this, this.onMouseOverShadowLine);
                connect.connect(snode, "onmouseout", this,
                    this.onMouseOutShadowLine);
			}
			catch(e)
			{
				console.log("ERRORRRRR!! " + e);
			}

			//console.log("polyline created");
			//this.line.setStroke({color: "#36A9CF", width: 1});

		},

		onMouseOutShadowLine: function(e)
		{
			//console.log("onMouseOutShadowLine. this.deaf = "+this.deaf);
            if(!this.deaf)
            {
                this.shadowline.setStroke({color: [0, 0, 0, 0], width: 10});
                if (this.shadowconnect)
                {
                    this.shadowconnect.remove();
                }
            }
		},

		onMouseOverShadowLine: function(e)
		{
            if(!this.deaf)
            {
                //console.log("onMouseOverShadowLine. this.deaf = "+this.deaf);
                this.shadowline.setStroke({color: [0, 0, 255, 0.2],
                    width: 10 });
                this.shadowconnect = connect.connect(
                    this.shadowline.getNode(), "onclick",
                    this, this.onShadowLineClick);
            }
		},

		onShadowLineClick: function(e)
		{
			if(this.line && !this.deaf)
			{
				console.log("sending disconnect event..");
				this.surface.remove(this.line);
				this.surface.remove(this.shadowline);
				dojo.publish("boxgraph_disconnect",
                    [this.firstport, this.secondport]);
			}
		},

		getRoute: function()
		{
			return this.getType().getRouting(this.firstport,
                this.secondport);
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



	})
 })
