dojo.provide("drawutil.connector");


dojo.require("dojox.gfx");

/*
The connector exists on two modes; 1 = Live, 2 = Decorative. The live mode means that a port has created it in responsoe to a user click and its line will be drawn conitnually in responsoe to
mouse movemenets - until the user clicks again within the ratio of another, accepting, port o another block. In decorative mode, it just renders the line between the two ports of the two blocks
*/
dojo.declare("drawutil.connector",  null ,
{    
    surface                 : "",
    routing                 : "straight", // "straight", "manhattan", "curved"

    constructor: function(args)
    {
        this.inherited(arguments);
        console.log("drawutil.connector constructor called. args are...");
        console.dir(args);
        if(!args.firstport || !args.secondport)
        {
            throw "Y U NO BOTH FIRST AND SECOND PORTS!!!?";   
        }
        this.firstport = args.firstport;
        this.secondport = args.secondport;
        this.surface = args.surface;
        this.drawLine();
    },
    
    flush: function()
    {
      if(this.line)
      {
        this.surface.remove(this.line);
        this.draawLine();
      }
    },
    
    drawLine: function()
    {
        console.log("drawutil.connector.drawLine called. this.firstport = "+this.firstport+", this.secondport = "+this.secondport);
        var j = parseInt(this.firstport.side/2, 10);
        var ll = this.getRoute();
        this.line = ll.x1 ? this.surface.createLine(ll) : this.surface.createPolyLine(ll);
        this.line.setStroke({color: "#06799F", width: 1});   
        console.log("--------------------------------------------------");
    },
    
    getRoute: function()
    {
       switch(this.routing)
       {
            case "straight":   
                return this.getStraightRouting();
            case "mahattan":
                return this.getmanhattanRouting();
            case "curved":
                return this.getCurvedRouting();
       }
    },
    
    getStraightRouting: function()
    {
        return {x1: this.firstport.x+j, y1: this.firstport.y+j, x2: this.secondport.x+j, y2: this.secondport.y+j}   ;
    },
    
    getManhattanRouting: function()
    {
        
    },
    
    getCurvedRouting: function()
    {
        return {x1: this.firstport.x+j, y1: this.firstport.y+j, x2: this.secondport.x+j, y2: this.secondport.y+j}   ;
    },
});