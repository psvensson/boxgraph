dojo.provide("drawutil.port");


dojo.require("dojox.gfx");

dojo.declare("drawutil.port",  null ,
{    
    surface             : "",
    side                : 10,
    x                   : 0,
    y                   : 0,

    constructor: function(args)
    {
        this.inherited(arguments);
        console.log("drawutil.port constructor. args are "+args);
        this.x = args.x;
        this.y = args.y;
        this.where = args.where;
        this.position = args.position;
        this.surface = args.surface;
    },
    
    remove: function()
    {
        console.log("drawutil.port remove called..");
      if(this.avatar)
      {
        this.surface.remove(this.avatar);   
      }
    },
    
    render: function(x, y)
    {
        this.x = x;
        this.y = y;
        //console.log("drawutil.port render called. x = "+x+", y = "+y);
        var rect = {x: x, y: y, width: this.side, height: this.side};
        //console.log("creating port with parameters..");
        //console.dir(rect);
        var red_rect = this.surface.createRect(rect);
        red_rect.setFill("white");
        red_rect.setStroke({color: "green", width: 1}); 
        this.avatar = red_rect;
        dojo.connect(red_rect.getNode(), "onclick", this, this.startConnect);
        dojo.connect(red_rect.getNode(), "onmouseover", this, this.mouseOver);
        dojo.connect(red_rect.getNode(), "onmouseout", this, this.mouseOut);
        dojo.subscribe("port_highlight", dojo.hitch(this, function(arg)
        {
            console.log("port highlight subsciption event. arg is ..");
            console.dir(arg);
            if(arg)
            {
                this.otherport = arg[0];   
            }
            else
            {
                this.otherport = null;   
            }
        }));
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
    },
    
    startConnect: function(e)
    {
        console.log("startconnect.:");
        this.drawLineEvent = this.surface.connect("onmousemove", this, this.drawLine);
        dojo.connect(this.surface, "onmouseup", this, this.stopConnect);
        dojo.connect(this.surface, "ondragstart",   dojo, "stopEvent");
        dojo.connect(this.surface, "onselectstart", dojo, "stopEvent");
    },
    
    drawLine: function(e)
    {
        console.log("drawLine..");
        console.dir(e);
          if(this.line)
          {
            this.surface.remove(this.line);
            this.line = null;
          }
          var ll = {x1: this.x, y1: this.y, x2: e.clientX, y2: e.clientY};
          this.line = this.surface.createLine(ll);
          this.line.setStroke({color: "red", width: 1});
    },
    
    stopConnect: function(e)
    {
       dojo.disconnect(this.drawLineEvent);
       this.drawLineEvent = null;
       if(this.otherport)
       {
          if(this.line)
          {
            this.surface.remove(this.line);
            this.line = null;
          }
          var ll = {x1: this.x, y1: this.y, x2: this.otherport.x, y2: this.otherport.y};
          this.line = this.surface.createLine(ll);
          this.line.setStroke({color: "red", width: 1}); 
       }           
    }
});