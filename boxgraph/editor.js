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
        "boxgraph/box",
        "dojo/_base/array"
    ],
    function(declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin
        , template, domStyle, baseFx, lang, gfx, port, portmanager,
             boxmanager, box, array)
    {
        return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin],
        {


		templateString			: template,
        surface           : null, // Can be provided, otherwise
        // we create a new surface
		editable					: true,	// Can the user create
		// new routes between boxes and/or delete existing routes?
		draggable					: true, // Can the user rearrange
		// the boxes in the editor?
		colors						: ["06799F", "216278",
            "024E68", "3AAACF", "62B4CF"],
		dataurl						: null,
		routing						: "manhattan",
		// "straight", "manhattan", "curved";
        numbering                   : false,
       
    postCreate: function()
    {
			this.inherited(arguments);

			if(!this.surface)
			{
				this.surface = gfx.createSurface(this.editordiv, 1200, 700);
			}
			this.routing = arguments.routing || this.routing;
			console.log("editor: this.routing = "+this.routing);
			//----
			this.boxmanager = new boxmanager();

        //this.domNode.style.backgroundColor = "yellow";
        this.boxmanager.editor = this;
			this.portmanager = new portmanager({surface : this.surface,
                boxmanager: this.boxmanager, routing: this.routing,
                numbering: this.numbering});
                // Need boxmanager to get coords of boxes when routing
			if(this.dataurl)
			{
				console.log("attempting to load data from url '"+
                    this.dataurl+"'");
				dojo.xhrGet(
                {
                    url: this.dataurl,
                    handleAs: 'json',
                    load: lang.hitch(this, this.loadGraph)
                });
			}
			else
			{
                //this.test();
			}
            console.log("editor constructor done");
    },

		loadGraph: function(data)
		{
            console.log("loadGraph called with data '"+data+"'");
            var rv = [];
            console.dir(data);
            this.colors = data.colors;
            console.log("-- creating boxes from file --");
            array.forEach(data.boxes, lang.hitch(this,
                function(thebox)
            {
                var ports = thebox.ports;
                //console.log("got "+ports.length+" ports from loaded box");
                thebox.ports = null;
                var newbox = new box({surface: this.surface, model: thebox});
                //console.log("newbox is "+newbox);
                this.boxmanager.addBox(newbox);
                array.forEach(ports, lang.hitch(this, function(port)
                {
                    this.boxmanager.addPort(newbox, port);
                    console.log(" -- saving port "+port+" under id '"+
                        port.id+"'");
                }));
                newbox.renderPorts();
                rv.push(newbox);
            }));

            //console.log("-- creating connections from file -- ");

            array.forEach(data.connections, lang.hitch(this,
                function(connection)
            {
                var p1 = this.boxmanager.getPortById(connection.first);
                var p2 = this.boxmanager.getPortById(connection.second);
                //console.log("connecting port '"+connection.first+
                // "' with port '"+connection.second+"'");
                this.portmanager.firstport = p1;
                this.portmanager.highlightport = p2;
                this.portmanager.stopConnect();
            }));

            console.log("---------------------- load finished");
            return rv;
		},
        
        serialize: function()
        {
            var rv = {};
            
            rv.colors = this.colors,
            rv.boxes = this.boxmanager.serializeBoxes();
            rv.connections = this.portmanager.serializeConnections();
            
            return rv;
        },

    test: function()
    {
        var block1 = new box({surface: this.surface, model:
        {name:"foo", x:50, y: 100, height:100, width: 100} });
        block1.addPort({ dir: "right", position: 1});
        block1.addPort({ dir: "right", position: 2});
        block1.addPort({ dir: "left", position: 1});
        block1.addPort({ dir: "up", position: 1});
        block1.addPort({ dir: "down", position: 1});
        this.boxmanager.addBox(block1);
        
        var block2 = new box({surface: this.surface, model:
        {name: "bar", x:200, y: 50, height:150, width: 100} });
        block2.addPort({ dir: "left", position: 1});
        block2.addPort({ dir: "right", position: 1});
        block2.addPort({ dir: "up", position: 1});
        block2.addPort({ dir: "down", position: 1});
        block2.addPort({ dir: "down", position: 2});
        this.boxmanager.addBox(block2);
        
        var block3 = new box({surface: this.surface, model:
        {name: "baz", x:150, y: 290, height:100, width: 100} });
        block3.addPort({ dir: "left", position: 1});
        block3.addPort({ dir: "right", position: 1});
        block3.addPort({ dir: "up", position: 1});
        block3.addPort({ dir: "left", position: 2});
        block3.addPort({ dir: "down", position: 1});
        this.boxmanager.addBox(block3);
        
        var block4 = new box({surface: this.surface, model:
        {name: "quux", x:340, y: 180, height:80, width: 130} });
        block4.addPort({ dir: "left", position: 1});
        block4.addPort({ dir: "right", position: 1});
        block4.addPort({ dir: "up", position: 1});
        block4.addPort({ dir: "left", position: 2});
        block4.addPort({ dir: "down", position: 1});
        this.boxmanager.addBox(block4);
              
        block1.renderPorts();
        block2.renderPorts();
        block3.renderPorts();
        block4.renderPorts();
        
    }
    })
});