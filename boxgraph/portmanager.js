dojo.provide("boxgraph.portmanager");


dojo.require("dojox.gfx");
dojo.require("boxgraph.connector");

dojo.declare("boxgraph.portmanager",  null ,
{    
    surface                 : "",
    firstnode               : "",
    secondnode              : "",
    connectors              : [],
    boxmnanager             : "",
    
    constructor: function(args)
    {
        this.surface = args.surface;
        this.boxmanager = args.boxmanager;
        
        console.log("boxgraph.portmanager constructor.");
        
        dojo.subscribe("port_highlight", dojo.hitch(this, function(arg)
        {                        
            if(arg)
            {
                console.log("portmanager highlight subsciption event. highlight port is now "+arg.name);
                this.highlightport = arg;   
            }
            else
            {
                console.log("** portmanager highlight subsciption event. highlightport is now deselected.");
                this.highlightport = null;
            }
        }));
        
        this.surface.connect("onmousedown", dojo.hitch(this, function(e)
        {
            console.log("boxgraph.portmanager onmousedown event handler. this.highlightport = "+this.highlightport);
            if(this.highlightport && !this.firstport)
            {               
                this.firstport = this.highlightport;   
                console.log("** setting first port to "+this.firstport);                               
                this.startConnect();
            }
        }));
    },
    
    startConnect: function(e)
    {
        console.log("startconnect for port "+this.name+" called");
        this.drawLineEvent = this.surface.connect("onmousemove", this, this.drawLine);
        this.mouseupevent = this.surface.connect("onmouseup", this, this.stopConnect);
        dojo.connect(this.surface, "ondragstart",   dojo, "stopEvent");
        dojo.connect(this.surface, "onselectstart", dojo, "stopEvent");
    },
    
    drawLine: function(e)
    {
        //console.log("portmanager.drawLine.. firstport is..");
        //console.dir(this.firstport);
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
        console.log("stopConnect called. this.firstport = "+this.firstport+", this.secondport = "+this.secondport);
        dojo.disconnect(this.drawLineEvent);
        dojo.disconnect(this.mouseupevent);
        this.drawLineEvent = null;
        if(!this.secondport)
        {
            this.secondport = this.highlightport;
            console.log("** setting second port to "+this.secondport);
            if(this.line)
            {
                this.surface.remove(this.line);
                this.line = null;
            }
            this.connectors.push(new boxgraph.connector({boxmanager: this.boxmanager, surface: this.surface, firstport: this.firstport, secondport: this.secondport}));
            this.firstport = this.secondport = null;
        }               
    }
});