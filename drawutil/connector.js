dojo.provide("drawutil.connector");


dojo.require("drawutil.routing.manhattan");
dojo.require("drawutil.routing.manhattan2");
dojo.require("drawutil.routing.straight");
dojo.require("drawutil.routing.curved");

dojo.require("dojox.gfx");

/*
The connector exists on two modes; 1 = Live, 2 = Decorative. The live mode means that a port has created it in responsoe to a user click and its line will be drawn conitnually in responsoe to
mouse movemenets - until the user clicks again within the ratio of another, accepting, port o another block. In decorative mode, it just renders the line between the two ports of the two blocks
*/
dojo.declare("drawutil.connector",  null ,
{    
    surface                 : "",
    //routing                 : "straight", // "straight", "manhattan", "curved"
    routing                 : "manhattan", // "straight", "manhattan", "curved"

    constructor: function(args)
    {
	this.manhattan = new drawutil.routing.manhattan();
	this.straight = new drawutil.routing.straight();
	this.curved = new drawutil.routing.curved();

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
        
        var ll = this.getRoute();
        console.log("got route of type '"+this.routing+"' ;");
        console.dir(ll);
        this.line = ll.x1 ? this.surface.createLine(ll) : this.surface.createPolyline(ll);
        this.line.setStroke({color: "#06799F", width: 1});   
        console.log("--------------------------------------------------");
    },
    
    getRoute: function()
    {
        var rv = "foo";
       switch(this.routing)
       {
            case "straight":   
                rv = this.straight.getRouting(this.firstport, this.secondport);
                break;
            case "manhattan":
                rv = this.manhattan.getRouting(this.firstport, this.secondport);
                break;
            case "curved":
                rv = this.curved.getRouting(this.firstport, this.secondport);
                break;
       }
       return rv;
    }   
    
     
    
});
