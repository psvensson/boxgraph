dojo.provide("boxgraph.connector");


dojo.require("boxgraph.routing.manhattan");
dojo.require("boxgraph.routing.manhattan2");
dojo.require("boxgraph.routing.straight");
dojo.require("boxgraph.routing.curved");

dojo.require("dojox.gfx");

/*
The connector exists on two modes; 1 = Live, 2 = Decorative. The live mode means that a port has created it in responsoe to a user click and its line will be drawn conitnually in responsoe to
mouse movemenets - until the user clicks again within the ratio of another, accepting, port o another block. In decorative mode, it just renders the line between the two ports of the two blocks
*/
dojo.declare("boxgraph.connector",  null ,
{    
    surface                 : "",
    //routing                 : "straight", // "straight", "manhattan", "curved"
    routing                 : "manhattan", // "straight", "manhattan", "curved"
    boxmanager              : "",
    
    constructor: function(args)
    {
    	this.inherited(arguments);
        console.log("boxgraph.connector constructor called. args are...");
        console.dir(args);
        if(!args.firstport || !args.secondport)
        {
            throw "Y U NO BOTH FIRST AND SECOND PORTS!!!?";   
        }
        this.firstport = args.firstport;
        this.secondport = args.secondport;
        this.surface = args.surface;
        this.boxmanager = args.boxmanager;
        
        //this.manhattan = new boxgraph.routing.manhattan({boxmanager: this.boxmanager});
        this.manhattan = new boxgraph.routing.manhattan2({boxmanager: this.boxmanager});
        this.straight = new boxgraph.routing.straight({boxmanager: this.boxmanager});
    	this.curved = new boxgraph.routing.curved({boxmanager: this.boxmanager});
        
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
        console.log("boxgraph.connector.drawLine called. this.firstport = "+this.firstport+", this.secondport = "+this.secondport);
        
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
