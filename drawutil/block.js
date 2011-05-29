dojo.provide("drawutil.block");

dojo.require("drawutil.base");
dojo.require("drawutil.port");
dojo.require("dojox.gfx");

dojo.declare("drawutil.block",  drawutil.base ,
{    
    surface                 : "",

    constructor: function()
    {
        this.inherited(arguments);
        console.log("drawutil.block constructor. this.model is "+this.model);
        this.render();
    },
    
    flush: function()
    {
        if(this.avatar)
        {
            console.log("drawutil.flush called. this.avatar = "+this.avatar);
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
        console.log("drawutil.render called. this.surface = "+this.surface);
        this.flush();
        this.renderEntity();
        this.renderPorts();  
    },
    
    renderEntity: function()
    {
        this.avatar = this.surface.createGroup();
        var red_rect = this.surface.createRect(this.model);
        //red_rect.setFill([255, 0, 0, 0.5]);
		red_rect.setStroke({color: "blue", width: 2, join: "round" });
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
            console.log("drawutil.block renderPorts rendering port "+p+", where = '"+port.where+"', position = "+port.position);
            var x,y;
            var jiff = 5 * port.position;
            switch(port.where)
            {
                case "left":
                    x = 0;
                    y = port.position * jiff;
                break;
                case "top":
                    x = port.position * jiff;
                    y = 0;
                break;
                case "right":
                    x = this.model.width;
                    y = port.position * jiff;
                break;
                case "bottom":
                    x = port.position * jiff;
                    y = this.model.height;
                break;
            }            
            port.render(this.model.x + x, this.model.y + y);
        }
    },
        
    addPort: function(p)
    {        
        console.log("drawutil.addPort called. p is..");
        console.dir(p);
        p.surface = this.surface;
        //p.surface = this.avatar;
        var port = new drawutil.port(p);
        this.ports.push(port);
        
    }
});