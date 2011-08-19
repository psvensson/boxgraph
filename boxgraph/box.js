dojo.provide("boxgraph.box");

dojo.require("boxgraph.base");
dojo.require("boxgraph.port");
dojo.require("dojox.gfx");

dojo.declare("boxgraph.box",  boxgraph.base ,
{    
    surface                 : "",
    name                    : "",
    ports                   : [],
    
    constructor: function(args)
    {
        console.log("boxgraph.box constructor");
        this.inherited(arguments);
        this.ports = [];
        console.log("boxgraph.box constructor. this.model is "+this.model);
        this.name = this.model.name;
        this.render();
    },
    
    flush: function()
    {
        if(this.avatar)
        {
            console.log("boxgraph.flush called for box '"+this.name+"'. this.avatar = "+this.avatar);
            this.surface.remove(this.avatar);
            this.avatar = null;
        }
        if(this.ports.length > 0)
        {
            for(var i=0; i < this.ports.length; i++)
            {
                var port = this.ports[i];
                port.remove();
            }
        }
    },
    
    render: function()
    {
        console.log("boxgraph.render called for box '"+this.name+"'. this.surface = "+this.surface);
        this.flush();
        this.renderEntity();
        this.renderPorts();  
    },
    
    renderEntity: function()
    {
        this.avatar = this.surface.createGroup();
        var red_rect = this.surface.createRect(this.model);
        //red_rect.setFill([255, 0, 0, 0.5]);
		red_rect.setStroke({color: "#3AAACF", width: 2, join: "round" });
		//red_rect.setTransform({dx: 100, dy: 100});
		//dojo.connect(red_rect.getNode(), "onclick", function(){ alert("red"); });
		red_rect.connect("onclick", function(){ alert("red"); });
        this.avatar.add(red_rect);
    },
    
    renderPorts: function()
    {
        
        for(var p in this.ports)
        {
            var port = this.ports[p];
            //console.log("boxgraph.box renderPorts called for box '"+this.name+"', rendering port "+p+", dir = '"+port.dir+"', position = "+port.position);
            var x,y;
            var jiff = 5 * port.position;
            switch(port.dir)
            {
                case "left":
                    x = -10;
                    y = port.position * jiff;
                break;
                case "up":
                    x = port.position * jiff;
                    y = -10;
                break;
                case "right":
                    x = this.model.width;
                    y = port.position * jiff;
                break;
                case "down":
                    x = port.position * jiff;
                    y = this.model.height;
                break;
            }            
            port.render(this.model.x + x, this.model.y + y);
        }
    },
        
    addPort: function(p)
    {        
        //console.log("boxgraph.addPort called. p is..");
        //console.dir(p);
        p.name = this.name+"_"+p.position;
        p.box = this;
        p.surface = this.surface;
        //p.surface = this.avatar;
        var port = new boxgraph.port(p);
        this.ports.push(port);
        
    }
});