dojo.provide("drawutil.portmanager");


dojo.require("dojox.gfx");


dojo.declare("drawutil.portmanager",  null ,
{    
    surface                 : "",
    firstnode               : "",
    secondnode              : "",

    constructor: function(args)
    {
        this.surface = args.surface;
        
        
        console.log("drawutil.portmanager constructor.");
        
        dojo.subscribe("port_highlight", dojo.hitch(this, function(arg)
        {                        
            if(arg)
            {
                console.log("portmanager highlight subsciption event. highlight port is now "+arg.name);
                this.highlightport = arg;   
            }
            else
            {
                console.log("portmanager highlight subsciption event. highlightport is now deselected.");
                this.highlightport = null;
            }
        }));
        
        this.surface.connect("onmousedown", dojo.hitch(this, function(e)
        {
            console.log("drawutil.portmanager onmousedown event handler. this.highlightport = "+this.highlightport);
            if(this.highlightport && !this.firstport)
            {               
                this.firstport = this.highlightport;   
                console.log("setting second port to "+this.secondport);                               
                this.startConnect();
            }
        }));
    },
    
    startConnect: function(e)
    {
        console.log("startconnect for port "+this.name+" called");
        this.drawLineEvent = this.surface.connect("onmousemove", this, this.drawLine);
        this.surface.connect("onmouseup", this, this.stopConnect);
        dojo.connect(this.surface, "ondragstart",   dojo, "stopEvent");
        dojo.connect(this.surface, "onselectstart", dojo, "stopEvent");
    },
    
    drawLine: function(e)
    {
        console.log("portmanager.drawLine.. firstport is..");
        console.dir(this.firstport);
        //console.dir(e);
          if(this.line)
          {
            this.surface.remove(this.line);
            this.line = null;
          }
          var j = parseInt(this.firstport.side/2, 10);
          var ll = {x1: this.firstport.x + j, y1: this.firstport.y + j, x2: e.clientX, y2: e.clientY};
          this.line = this.surface.createLine(ll);
          this.line.setStroke({color: "#06799F", width: 1});
    },
    
    stopConnect: function(e)
    {
        console.log("stopConnect for port "+this.name+" called");
        dojo.disconnect(this.drawLineEvent);
        this.drawLineEvent = null;
        if(!this.secondport)
        {
            this.secondport = this.highlightport;
            console.log("setting second port to "+this.firstport);
            if(this.line)
            {
                this.surface.remove(this.line);
                this.line = null;
            }
            var ll = {x1: this.firstport.x, y1: this.firstport.y, x2: this.secondport.x, y2: this.secondport.y};
            this.line = this.surface.createLine(ll);
            this.line.setStroke({color: "#06799F", width: 1});
            this.firstport = this.secondport = null;
        }               
    }
});