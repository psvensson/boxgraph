dojo.provide("drawutil.connector");


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
                rv = this.getStraightRouting();
                break;
            case "manhattan":
                rv = this.getManhattanRouting();
                break;
            case "curved":
                rv = this.getCurvedRouting();
                break;
       }
       return rv;
    },
    
    getStraightRouting: function()
    {
        var j = parseInt(this.firstport.side/2, 10);
        return {x1: this.firstport.x+j, y1: this.firstport.y+j, x2: this.secondport.x+j, y2: this.secondport.y+j}   ;
    },
    
    getManhattanRouting: function()
    {
        var rv = [{x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}];  // Four points in manhattan
        var fp = this.firstport;
        var sp = this.secondport;
        console.log("Manhattan; first and second ports are..");
        console.dir({fp:fp, sp:sp});
        var diffx = sp.x - fp.x;
        var diffy = sp.y - fp.y;
        var hdx = parseInt(diffx/2, 10);
        var hdy = parseInt(diffy/2, 10);
        console.log("Manhattan: diffx="+diffx+", diffy="+diffy+", hdx="+hdx+". hdy="+hdy);
        var sphup = sp.block.height + sp.position * 5;
        var spwup = sp.block.width + sp.position * 5;
        // -------------------------------- 0
        if(fp.where == "top")
        {
            rv[0].x = fp.x;
            rv[0].y = fp.y + fp.side;   
        }
        if(fp.where == "right")
        {
            rv[0].x = fp.x + fp.side;
            rv[0].y = fp.y;   
        }
        if(fp.where == "bottom")
        {
            rv[0].x = fp.x;
            rv[0].y = fp.y - fp.side;   
        }
        if(fp.where == "left")
        {
            rv[0].x = fp.x - fp.side;
            rv[0].y = fp.y;   
        }
        // -------------------------------- 1
        if(fp.where == "left" && sp.where == "right")
        {            
            rv[1].x = fp.x - hdx;
            rv[1].y = fp.y;
        }
        if(fp.where == "right" && sp.where == "left")
        {            
            rv[1].x = fp.x + hdx;
            rv[1].y = fp.y;
        }
        if(fp.where == sp.where && sp.where == "left" || fp.where == sp.where && sp.where == "right")
        {
            rv[1].x = rv[0].x;
            if(diffy > 0)
            {
                rv[1].y = rv[0].y + sphup;                
            }
            else
            {
                rv[1].y = rv[0].y - sphup;              
            }
        }
        if(fp.where == sp.where && sp.where == "top" || fp.where == sp.where && sp.where == "bottom")
        {
            rv[1].y = rv[0].y;
            if(diffx > 0)
            {
                rv[1].x = rv[0].x + shpwup;                
            }
            else
            {
                rv[1].x = rv[0].x - spwup;              
            }
        }
        // -------------------------------- 2
        if(diffx > 0)
        {
               
        }
        
        // -------------------------------- 3
        return rv;
    },
    
    getCurvedRouting: function()
    {
        var j = parseInt(this.firstport.side/2, 10);
        return {x1: this.firstport.x+j, y1: this.firstport.y+j, x2: this.secondport.x+j, y2: this.secondport.y+j}   ;
    },
});