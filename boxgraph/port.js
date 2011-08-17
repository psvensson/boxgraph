dojo.provide("boxgraph.port");


dojo.require("dojox.gfx");

dojo.declare("boxgraph.port",  null ,
{    
    surface             : "",
    side                : 10,
    x                   : 0,
    y                   : 0,
    dir               : "",  // "right", "left", "up", "down"

    constructor: function(args)
    {
        this.inherited(arguments);
        //console.log("boxgraph.port constructor. args are "+args);
        this.x = args.x;
        this.y = args.y;
        this.dir = args.dir;
        this.position = args.position;
        this.surface = args.surface;
        this.name = args.name;
        this.box = args.box;
    },
    
    remove: function()
    {
        //console.log("boxgraph.port "+this.name+" remove called..");
      if(this.avatar)
      {
        this.surface.remove(this.avatar);   
      }
    },
    
    render: function(x, y)
    {
        this.x = x;
        this.y = y;
        //console.log("boxgraph.port "+this.name+" render called. x = "+x+", y = "+y);
        var rect = {x: x, y: y, width: this.side, height: this.side};
        //console.log("creating port with parameters..");
        //console.dir(rect);
        var red_rect = this.surface.createRect(rect);
        red_rect.setFill("#66A3D2");
        red_rect.setStroke({color: "#3AAACF", width: 1}); 
        this.avatar = red_rect;
                
        dojo.connect(red_rect.getNode(), "onmouseover", this, this.mouseOver);
        dojo.connect(red_rect.getNode(), "onmouseout", this, this.mouseOut);
        
        //'this.surface.add(this.avatar);
    },
    
    mouseOver: function(e)
    {
        if(!this.drawLineEvent)
        {
            this.highlight();
            dojo.publish("port_highlight", [this]);   
        }
    },
    
    mouseOut: function(e)
    {
        this.lowlight(); 
        dojo.publish("port_highlight", [null]);
    },
    
    highlight: function()
    {
        this.avatar.setStroke({color: "yellow", width: 2});
    },
    
    lowlight: function()
    {
        this.avatar.setStroke({color: "green", width: 1});   
    }
    
    
});