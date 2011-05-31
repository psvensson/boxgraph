dojo.provide("drawutil.portmanager");


dojo.require("dojox.gfx");


dojo.declare("drawutil.portmanager",  null ,
{    
    surface                 : "",

    constructor: function()
    {
        this.inherited(arguments);
        console.log("drawutil.portmanager constructor.");
        
    }
});