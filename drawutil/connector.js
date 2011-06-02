dojo.provide("drawutil.connector");


dojo.require("dojox.gfx");

/*
The connector exists on two modes; 1 = Live, 2 = Decorative. The live mode means that a port has created it in responsoe to a user click and its line will be drawn conitnually in responsoe to
mouse movemenets - until the user clicks again within the ratio of another, accepting, port o another block. In decorative mode, it just renders the line between the two ports of the two blocks
*/
dojo.declare("drawutil.connector",  null ,
{    
    surface                 : "",

    constructor: function(args)
    {
        this.inherited(arguments);
        console.log("drawutil.block connector.");
        this.firstport = args.firstport;
        this.secondport = args.secondport;
        this.surface = args.surface;
        this.drawLine();
    },
    
    drawLine: function()
    {
        console.log("drawutil.connector.drawLine called. this.firstport = "+this.firstport+", this.secondport = "+this.secondport);
        var ll = {x1: this.firstport.x, y1: this.firstport.y, x2: this.secondport.x, y2: this.secondport.y};
        this.line = this.surface.createLine(ll);
        this.line.setStroke({color: "#06799F", width: 1});   
    }
});