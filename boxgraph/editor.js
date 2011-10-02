dojo.provide("boxgraph.editor");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");

dojo.require("dojox.gfx");
dojo.require("boxgraph.box");
dojo.require("boxgraph.portmanager");
dojo.require("boxgraph.boxmanager");

dojo.declare("boxgraph.editor", [ dijit._Widget, dijit._Templated ],
{
		templatePath			: dojo.moduleUrl("boxgraph", "editor.html"),
    surface           : null, // Can be provided, otherwise we create a new surface
		editable					: true,	// Can the user create new routes between boxes and/or delete existing routes?
		draggable					: true, // Can the user rearrange the boxes in the editor?
		colors						: ["06799F", "216278", "024E68", "3AAACF", "62B4CF"],
		dataurl						: null,
		routing						: "manhattan", // "straight", "manhattan", "curved";
        numbering                   : false,
       
    postCreate: function()
    {
			this.inherited(arguments);
			console.log("postCreate in boxgraph.editor called. this.dataurl = '"+this.dataurl+"'");
			if(!this.surface)
			{
				this.surface = dojox.gfx.createSurface(this.editordiv, 500, 500);
			}
			this.routing = arguments.routing || this.routing;
			console.log("editor: this.routing = "+this.routing);
			//----
			this.boxmanager = new boxgraph.boxmanager();
			this.portmanager = new boxgraph.portmanager({surface : this.surface, boxmanager: this.boxmanager, routing: this.routing, numbering: this.numbering}); // Need boxmanager to get coords of boxes when routing
			if(this.dataurl)
			{
				console.log("attempting to load data from url '"+this.dataurl+"'");
				dojo.xhrGet(
					{
						url: this.dataurl,
						handleAs: 'json',
						load: dojo.hitch(this, this.loadGraph)
					});
			}
			else
			{
        this.test();
			}
    },

		loadGraph: function(data)
		{
				console.log("loadGraph called with data '"+data+"'");

				console.dir(data);
				this.colors = data.colors;
			console.log("-- creating boxes from file --");
				dojo.forEach(data.boxes, dojo.hitch(this, function(box)
				{
					var ports = box.ports;
					box.ports = null;
					var newbox = new boxgraph.box({surface: this.surface, model: box});
					this.boxmanager.addBox(newbox);
					dojo.forEach(ports, dojo.hitch(this, function(port)
					{
						this.boxmanager.addPort(newbox, port);
						console.log(" -- saving port "+port+" under id '"+port.id+"'");
					}));
					newbox.renderPorts();
				}));
			console.log("-- creating connections from file -- ");
			
				dojo.forEach(data.connections, dojo.hitch(this, function(connection)
				{
					var p1 = this.boxmanager.getPortById(connection.first);
					var p2 = this.boxmanager.getPortById(connection.second);
					console.log("connecting port '"+connection.first+"' with port '"+connection.second+"'");
					this.portmanager.firstport = p1;
					this.portmanager.highlightport = p2;
					this.portmanager.stopConnect();
				}));
		},

    test: function()
    {
        var block1 = new boxgraph.box({surface: this.surface, model: {name:"foo", x:50, y: 100, height:100, width: 100} });
        block1.addPort({ dir: "right", position: 1});
        block1.addPort({ dir: "right", position: 2});
        block1.addPort({ dir: "left", position: 1});
        block1.addPort({ dir: "up", position: 1});
        block1.addPort({ dir: "down", position: 1});
        this.boxmanager.addBox(block1);
        
        var block2 = new boxgraph.box({surface: this.surface, model: {name: "bar", x:200, y: 50, height:150, width: 100} });
        block2.addPort({ dir: "left", position: 1});
        block2.addPort({ dir: "right", position: 1});
        block2.addPort({ dir: "up", position: 1});
        block2.addPort({ dir: "down", position: 1});
        block2.addPort({ dir: "down", position: 2});
        this.boxmanager.addBox(block2);
        
        var block3 = new boxgraph.box({surface: this.surface, model: {name: "baz", x:150, y: 290, height:100, width: 100} });
        block3.addPort({ dir: "left", position: 1});
        block3.addPort({ dir: "right", position: 1});
        block3.addPort({ dir: "up", position: 1});
        block3.addPort({ dir: "left", position: 2});
        block3.addPort({ dir: "down", position: 1});
        this.boxmanager.addBox(block3);
        
        var block4 = new boxgraph.box({surface: this.surface, model: {name: "quux", x:340, y: 180, height:80, width: 130} });
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
});