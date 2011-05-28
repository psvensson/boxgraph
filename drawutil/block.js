dojo.provide("drawutil.block");

dojo.require("drawutil.base");
dojo.require("dojox.gfx");

dojo.declare("drawutil.block",  drawutil.base ,
{    
    surface                 : "",

    constructor: function()
    {
        this.inherited(arguments);
        console.log("drawutil.block constructor. this.model is "+this.model);
        var red_rect = this.surface.createRect(this.model);
		red_rect.setFill([255, 0, 0, 0.5]);
		red_rect.setStroke({color: "blue", width: 10, join: "round" });
		red_rect.setTransform({dx: 100, dy: 100});
		//dojo.connect(red_rect.getNode(), "onclick", function(){ alert("red"); });
		red_rect.connect("onclick", function(){ alert("red"); });
    }
});